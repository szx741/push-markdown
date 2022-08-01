<!--
 * @Author: szx
 * @Date: 2021-07-08 13:09:13
 * @LastEditTime: 2022-08-01 20:13:21
 * @Description: 单个标签，含标题和关闭按钮
 * @FilePath: \push-markdown\packages\renderer\src\components\TabTitle.vue
-->
<script setup lang="ts">
  const props = defineProps<{
    tabType: string;
    tabTitle: string;
    selected: boolean;
    modified?: boolean;
    tabClick: any;
    tabRefresh: any;
    tabClose: any;
  }>();
</script>
<template>
  <div class="tab" :class="{ selected: props.selected }" @click="props.tabClick" @click.middle="props.tabClose" @click.right="props.tabClose">
    <span>{{ props.modified ? '* ' : '' }}{{ props.tabTitle || '' }}</span>

    <svg v-if="props.tabType === 'markdown'" viewBox="0 0 1024 1024" @click.stop="props.tabRefresh">
      <path
        d="M674.133333 878.933333l-98.133333-102.4c128-17.066667 230.4-123.733333 230.4-251.733333 0-123.733333-93.866667-230.4-217.6-251.733333l-89.6-89.6h38.4c196.266667 0 354.133333 153.6 354.133333 341.333333 0 128-76.8 243.2-183.466666 298.666667v85.333333l-34.133334-29.866667z m-93.866666-17.066666c-12.8 0-29.866667 4.266667-46.933334 4.266666-196.266667 0-354.133333-153.6-354.133333-341.333333 0-128 76.8-243.2 183.466667-298.666667V128l55.466666 55.466667 85.333334 85.333333c-132.266667 12.8-234.666667 123.733333-234.666667 256 0 128 98.133333 234.666667 226.133333 251.733333l85.333334 85.333334z"
      ></path>
    </svg>

    <svg viewBox="0 0 1024 1024" @click.stop="props.tabClose">
      <path
        d="M576 512l277.333333 277.333333-64 64-277.333333-277.333333L234.666667 853.333333 170.666667 789.333333l277.333333-277.333333L170.666667 234.666667 234.666667 170.666667l277.333333 277.333333L789.333333 170.666667 853.333333 234.666667 576 512z"
      ></path>
    </svg>
  </div>
</template>

<style lang="scss" scoped>
  .tab {
    display: flex;
    height: 100%;
    flex-direction: row;
    align-items: center;
    min-width: 150px;
    user-select: none;
    font-size: 95%;
    margin-right: 2px;
    cursor: pointer;
    padding: 0 10px;

    span {
      text-align: center;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow-x: hidden;
      margin-right: 5px;
      flex: 1;
    }

    svg {
      height: 22px;
      width: 22px;
      &:hover {
        background-color: #aaa;
      }
    }
  }
</style>
