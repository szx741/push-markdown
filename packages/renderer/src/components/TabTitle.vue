<!--
 * @Author: szx
 * @Date: 2021-07-08 13:09:13
 * @LastEditTime: 2022-07-26 19:35:28
 * @Description: 单个标签，含标题和关闭按钮
 * @FilePath: \push-markdown\packages\renderer\src\components\TabTitle.vue
-->

<script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({
    name: 'TabTitle',
    props: ['tabType', 'tabTitle', 'selected', 'modified', 'tabClick', 'tabRefresh', 'tabClose']
  });
</script>
<template>
  <div class="tab" :class="{ selected: selected }" @click="tabClick" @click.middle="tabClose" @click.right="tabClose">
    <span>{{ modified ? '* ' : '' }}{{ tabTitle || '' }}</span>
    <img v-if="tabType === 'markdown'" src="../common/assets/refresh.png" @click.stop="tabRefresh" />
    <img src="../common/assets/close.png" @click.stop="tabClose" />
  </div>
</template>

<style lang="scss" scoped>
  // @import '/@/common/assets/style.scss';

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
