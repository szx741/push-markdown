<!--
 * @Author: szx
 * @Date: 2021-07-08 13:09:13
 * @LastEditTime: 2021-08-11 23:53:37
 * @Description: 单个标签，含标题和关闭按钮
 * @FilePath: \push-markdown\src\components\TabTitle.vue
-->
<template>
  <div class="tab" :class="{ selected: selected }" @click="tabClick">
    <span>{{ modified ? '* ' : '' }}{{ tabTitle || '' }}</span>
    <img src="../common/assets/close.png" @click.stop="tabClose" />
  </div>
</template>

<script lang="ts">
  export default {
    name: 'TabTitle',
    props: ['tabTitle', 'selected', 'modified', 'tabClick', 'tabClose']
  };
</script>

<style lang="scss" scoped>
  // @import '@/common/assets/style.scss';

  .tab {
    display: flex;
    flex-direction: row;
    align-items: center;

    user-select: none;

    height: 100%;
    font-size: 90%;
    width: 150px;

    padding-left: 8px;
    padding-right: 5px;

    margin-right: 2px;

    background-color: #ddd;

    &.selected {
      // background-color: #ddd;
      background-color: white;
    }

    span {
      text-align: center;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow-x: hidden;

      margin-right: 5px;
      flex-grow: 1;
    }

    img {
      height: 70%;
      width: auto;

      &:hover {
        background-color: #eee;
      }
    }
  }
</style>
