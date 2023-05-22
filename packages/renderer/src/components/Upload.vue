<script setup lang="ts">
  import { ref, computed, onUnmounted, Ref, watch } from 'vue';
  import { cloneDeep } from 'lodash-es';
  import { openDir, toSystemTimezone } from '../utils/tools';
  import { ipc, nodeFs, nodePath } from '#preload';
  import { mdRenderFrontMatter, mdContentToHtml, Attr } from '../mdRenderer';
  import { publishers } from '../conf/sites';
  import { PublishMode, PublishParams } from '../mdPublish';
  import { sites } from '../conf/sites';

  interface MDFile {
    name: string;
    filePath: string;
    selected: boolean;
    show: boolean;
    msg: string;
    content: any;
    cache: string;
    attr: Attr;
  }

  const folderPath = ref(''),
    mdFiles: Ref<MDFile[]> = ref([]),
    currentPage = ref(1),
    pageSize = ref(20),
    selectAll = ref(false),
    sortByField = ref('name'),
    filterCached = ref('all'),
    sortAsc = ref(true),
    uploadMode = ref(PublishMode.Auto),
    pageSizes = [5, 10, 20, 50, 100],
    errorNum = [1, 2, 3, 4, 5],
    maxErrorNum = ref(2),
    siteIndex = ref(sites.value.length),
    showFull = ref(false),
    description = `注意：本界面的批量上传目前还处于实验状态，并非很稳定，慎用！
    已知bug：在页数大于1的情况下，更改筛选条件或者更改页数数量，当前页面并不会变，导致列表为空，此bug不修复，难弄；
    最多错误数：指的是此次批量上传的过程中，如果出现错误数量大于最多错误数，则会立即停止，后续不再上传；
    缓存：指的是在本地已经有上传的记录了，如果有记录，非常不建议切换到创建新文章的模式！
    发布模式建议一直采用自动检测，否则可能容易出现一些莫名的bug；
    强烈建议在使用本界面的时候先单独打开几篇文章上传试试看，尤其是示例文档，那个能够跑通的话其他的问题不大；
    批量上传是单线程的，只有前一篇上传完成之后，才会继续下一篇的上传，主要是为了保险起见，多文件并行上传难以控制；
    本批量上传界面做了一定的数据缓存，因此可能存在一些bug，如果有问题，可以重新打开文件夹来重置数据；
    如果有错误情况出现，建议单独打开这个文件看看渲染有没有出问题，或者单独上传看看报什么错误；
    有问题去https://gitee.com/xaotuman/push-markdown/issues反应问题；`;

  let allPostCache: any = {};

  // computed属性
  const selectedFiles = computed(() => mdFiles.value.filter((md) => md.selected)),
    pageCount = computed(() => Math.ceil(mdFiles.value.length / pageSize.value)),
    pageNum = computed(() => {
      const startIndex = (currentPage.value - 1) * pageSize.value + 1;
      const endIndex = startIndex + pageSize.value;
      return Array.from({ length: endIndex - startIndex + 1 }, (_, i) => i + startIndex);
    }),
    displayedFiles = computed(() => {
      let allShowArr = mdFiles.value;
      if (filterCached.value !== 'all') allShowArr = mdFiles.value.filter((file) => (filterCached.value === 'cache') === Number.parseInt(file.cache) > 0);
      const startIndex = (currentPage.value - 1) * pageSize.value;
      const endIndex = Math.min(startIndex + pageSize.value, allShowArr.length);
      return allShowArr.slice(startIndex, endIndex);
    }),
    notice = computed(() => description.replace(/\n/g, '<br>'));

  watch(displayedFiles, (newDisplayedFiles) => {
    const fileReadPromises = [];
    for (let mdfile of newDisplayedFiles) {
      if (!mdfile.content) fileReadPromises.push(readFilePromise(mdfile, mdfile.filePath));
    }
    Promise.all(fileReadPromises)
      .then(() => {
        console.log('所有文件都读取完毕');
      })
      .catch((err) => console.log(err));
  });

  // 下面写方法
  const destory = ipc.receive('openDir', (args: any) => {
    folderPath.value = args.folderPath;
    allPostCache = publishers[siteIndex.value - 1].postCache.getAll();
    mdFiles.value = args.allMd.map((md: string) => ({
      name: md,
      filePath: nodePath.pathJoin(folderPath.value, md),
      selected: false,
      cache: '-1',
      attr: null,
      show: true,
      content: null,
      msg: ''
    }));
    currentPage.value = 1;
    filterCached.value = 'all';
    sortAsc.value = true;
    sortBy('name');
  });

  const readFilePromise = async (mdfile: MDFile, path: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      nodeFs.fsReadFile(path, { encoding: 'utf-8' }, (err, data) => {
        if (err) {
          reject(err);
          mdfile.msg = err.message;
          return;
        }
        const { content, attr } = mdRenderFrontMatter(data.toString(), path);
        if (attr.url && allPostCache[attr.url.toLowerCase()]) mdfile.cache = allPostCache[attr.url.toLowerCase()]?.post_id || '-1';
        mdfile.attr = attr;
        mdfile.content = content;
        resolve(data.toString());
      });
    });
  };

  const sortBy = (field: string) => {
    if (sortByField.value === field) {
      sortAsc.value = !sortAsc.value;
    } else {
      sortByField.value = field;
      sortAsc.value = true;
    }
    mdFiles.value.sort((a: any, b: any) => {
      let cmp = a[field].localeCompare(b[field], undefined, { sensitivity: 'base' });
      if (!sortAsc.value) cmp = -cmp;
      return cmp;
    });
  };

  const uploadSelectedFiles = async () => {
    const selectedFiles = mdFiles.value.filter((file) => file.selected);
    const publisher = publishers[siteIndex.value - 1];
    let errCnt = 0;
    for (let selected of selectedFiles) {
      if (errCnt >= maxErrorNum.value) {
        selected.msg = '错误已达最大值，当前及后面的文件都停止上传！';
        return;
      }
      const post = mdContentToHtml(selected.content, selected.attr, selected.filePath);
      const _post = cloneDeep(post);
      const publishParams: PublishParams = {
        post: _post,
        inputID: '0',
        oldPostID: selected.cache,
        stateHandler: () => {},
        publishMode: uploadMode.value,
        detail: { notCheck: true, forcedUpdate: false },
        editHandler: undefined
      };
      try {
        // console.log(publishParams);
        const res = await publisher.publish(publishParams);
        if (res && Number.parseInt(res) > 0) {
          selected.msg = '上传成功';
          selected.cache = res;
        } else {
          errCnt++;
          selected.msg = `错误：${res}`;
        }
      } catch (e: any) {
        selected.msg = `错误:${e.message}`;
        errCnt++;
        console.error(e);
      }
    }
  };

  const toggleSelectAll = () => {
    selectAll.value = !selectAll.value;
    mdFiles.value.forEach((file) => {
      file.selected = selectAll.value;
    });
  };

  const handleFileClick = (mdFile: MDFile) => {
    mdFile.selected = !mdFile.selected;
    if (selectedFiles.value.length === displayedFiles.value.length) selectAll.value = true;
    else selectAll.value = false;
  };

  const isCached = (file: MDFile) => {
    const bool = Number.parseInt(file.cache) > 0;
    return { checkmark: bool, crossmark: !bool };
  };

  const isError = (file: MDFile) => {
    if (file.msg.includes('错误')) return { 'error-msg': true };
  };

  const changePage = (page: number) => (currentPage.value += page);
  const changeNotice = () => {
    showFull.value = !showFull.value;
  };
  onUnmounted(() => {
    console.log('销毁页面？');
    if (destory) destory();
  });
</script>

<template>
  <div class="container">
    <div class="upload-container">
      <!-- 说明事项界面 -->
      <div v-show="showFull" class="notice-box" v-html="notice"></div>

      <!-- 打开文件夹按钮 -->
      <div class="upload-opendir">
        <button class="upload-btn-notice" @click="changeNotice">查看注意事项</button>
        <button class="upload-btn" @click="openDir">打开文件夹</button>
        <span class="upload-filepath">{{ folderPath }}</span>
      </div>

      <!-- 筛选 -->
      <div class="upload-filter">
        <button class="upload-filter-btn" @click="toggleSelectAll">{{ selectAll ? '全不选' : '全　选' }}</button>
        <span>
          筛选
          <select v-model="filterCached" class="upload-filter-select">
            <option value="all">所有</option>
            <option value="cache">已缓存</option>
            <option value="nocached">未缓存</option>
          </select>
        </span>
        <span>
          发布模式
          <select v-model="uploadMode" class="upload-filter-select">
            <option value="auto">自动判断</option>
            <option value="create">创建新文章</option>
          </select>
        </span>
        <span>
          最多错误数
          <select v-model="maxErrorNum" class="upload-filter-select">
            <option v-for="num in errorNum" :key="num" :value="num">{{ num }}</option>
          </select>
        </span>
        <span>
          <button class="upload-filter-btn-publish" @click="uploadSelectedFiles">发布到</button>
          <select v-model="siteIndex" class="upload-filter-select">
            <option v-for="num in siteIndex" :key="num" :value="num">第 {{ num }} 个博客</option>
          </select>
        </span>
      </div>

      <!-- 文件列表 -->
      <table class="upload-table">
        <thead>
          <tr>
            <th><input v-model="selectAll" type="checkbox" class="upload-checkbox" @click="toggleSelectAll" /></th>
            <th class="upload-table-th-1">序号</th>
            <th class="upload-table-th-1">缓存</th>
            <th class="upload-file-name" :class="{ 'arrow-asc': sortAsc }" @click="sortBy('name')">文件名称</th>
            <th class="upload-table-th-2">链接</th>
            <th class="upload-table-th-3">特色图片</th>
            <th class="upload-file-message">信息</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(mdfile, index) in displayedFiles" :key="mdfile.name">
            <td><input v-model="mdfile.selected" type="checkbox" class="upload-checkbox" @click="handleFileClick(mdfile)" /></td>
            <td class="upload-table-td-1">{{ pageNum[index] }}</td>
            <td class="upload-table-td-1" :class="isCached(mdfile)"></td>
            <td>{{ mdfile.name }}</td>
            <td> {{ mdfile.attr?.url }} </td>
            <td> <img v-if="mdfile.attr?.thumbnail" class="upload-meta-thumbnail" :src="mdfile.attr?.thumbnail" /></td>
            <td class="upload-table-msg-td" :class="isError(mdfile)">{{ mdfile.msg }}</td>
          </tr>
        </tbody>
      </table>

      <!-- 页码 -->
      <div class="upload-pagination">
        <button class="upload-pagination-btn" :disabled="currentPage === 1" @click="changePage(-1)">上一页</button>
        <span class="upload-pagination-info">{{ currentPage }} / {{ pageCount }}</span>
        <button class="upload-pagination-btn" :disabled="currentPage === pageCount" @click="changePage(1)">下一页</button>
        <select v-model="pageSize" class="upload-pagination-select">
          <option v-for="size in pageSizes" :key="size" :value="size">{{ size }} 条/页</option>
        </select>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .container {
    width: 100%;
    height: 100%;
    overflow: auto;
    box-sizing: border-box;

    &::-webkit-scrollbar {
      width: 7px;
      height: 1px;
    }
    /*定义滚动条的滑块的样式有圆角和阴影以及自定义的背景色*/
    &::-webkit-scrollbar-thumb {
      border-radius: 4px;
      background: #d4d4d4;
    }
    /*定义滚动条所在轨道的样式。有圆角和阴影以及淡色系的背景色*/
    &::-webkit-scrollbar-track {
      border-radius: 4px;
      background: #f1f1f1;
    }
  }

  .upload-container {
    padding: 20px 0 60px;
    width: 900px;
    margin: auto;
    max-width: 100%;
  }

  .notice-box {
    width: 900px;
    margin-bottom: 20px;
    border: 1px solid #ccc;
  }

  .checkmark::before {
    content: '\2713';
    color: green;
  }
  .crossmark::before {
    content: '\2715';
    color: red;
  }

  .upload-meta-thumbnail {
    width: 70px;
    height: 70px;
    object-fit: cover;
  }

  .upload-opendir {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    .upload-btn {
      padding: 5px 10px;
      background-color: #2d9cdb;
      color: #fff;
      border: none;
      border-radius: 5px;
      margin-right: 10px;
      cursor: pointer;
      &-notice {
        padding: 5px 10px;
        background-color: rgb(219, 219, 219);
        color: #fdfdfd;
        border: none;
        border-radius: 5px;
        margin-right: 10px;
        cursor: pointer;
        &:hover {
          background-color: rgb(156, 156, 156);
        }
      }
    }
    .upload-filepath {
      font-size: 16px;
      color: #666;
      border-bottom: 1px solid #ccc;
      padding-bottom: 2px;
      margin-left: 10px;
    }
  }

  .upload-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 16px;

    .upload-table-th-1 {
      width: 32px;
    }

    .upload-table-th-2 {
      width: 230px;
    }
    .upload-table-th-3 {
      width: 75px;
    }
    .upload-table-td-1 {
      text-align: center;
    }
    .upload-file-message {
      width: 105px;
      text-align: center;
    }
    .error-msg {
      color: red;
    }
  }

  .upload-checkbox {
    margin: 0;
  }

  .upload-file-name {
    cursor: pointer;
    width: 220px;
    &::before {
      content: '';
      display: inline-block;
      margin-right: 4px;
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 4px 4px 0 4px;
      border-color: #aaa transparent transparent transparent;
      vertical-align: middle;
      opacity: 0.4;
      transition: opacity 0.3s ease, transform 0.3s ease;
    }

    &.arrow-asc::before {
      transform: rotate(180deg);
    }

    &:hover::before {
      opacity: 1;
    }
  }

  .upload-pagination {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 20px;
    padding: 0.5rem;
    // border-top: 1px solid #ccc;

    background-color: #f5f5f5;
    border-radius: 4px;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);

    .upload-pagination-btn {
      height: 28px;
      padding: 0 10px;
      margin-right: 10px;
      font-size: 14px;
      color: #333;
      border: 1px solid #ccc;
      border-radius: 3px;
      background-color: #fff;

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      &:hover:not(:disabled) {
        background-color: #eee;
      }
    }

    .upload-pagination-info {
      font-size: 14px;
      color: #333;
      margin-right: 10px;
    }

    .upload-pagination-select {
      height: 2rem;
      padding: 0 10px;
      font-size: 14px;
      color: #333;
      border: 1px solid #ccc;
      border-radius: 3px;
      background-color: #fff;
      margin-left: 10px;
    }
  }

  .upload-filter {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem;
    // border-bottom: 1px solid #ccc;
    // border-top: 1px solid #ccc;

    background-color: #f5f5f5;
    border-radius: 4px;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);

    .upload-filter-btn {
      height: 2rem;
      padding: 0.25rem 1rem;
      background-color: #007bff;
      color: #fff;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        background-color: #0069d9;
      }

      &:focus {
        outline: none;
        box-shadow: 0 0 0 0.2rem rgba(243, 37, 37, 0.5);
      }
    }

    span {
      display: flex;
      align-items: center;
      margin-left: 1.5rem;

      select {
        height: 2rem;
        margin-left: 0.5rem;
        padding: 0.25rem;
        font-size: 1rem;
        border: 1px solid #ced4da;
        border-radius: 4px;
        cursor: pointer;

        &:focus {
          outline: none;
          box-shadow: 0 0 0 0.2rem rgba(38, 143, 255, 0.5);
        }
      }

      .upload-filter-btn-publish {
        background-color: red;
        color: white;
        border: 1px solid red;
        border-radius: 3px;
        padding: 0.3rem 0.8rem;
        font-size: 1rem;
        cursor: pointer;
        transition: all 0.3s;
        &:hover {
          background-color: rgb(230, 27, 27);
          color: white;
        }
      }
    }
  }
</style>
