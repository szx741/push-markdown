<!--
 * @Author: szx
 * @Date: 2021-07-08 13:09:13
 * @LastEditTime: 2022-07-31 22:15:25
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
    <img v-if="props.tabType === 'markdown'" src="../common/assets/refresh.png" @click.stop="props.tabRefresh" />
    <img src="../common/assets/close.png" @click.stop="props.tabClose" />
  </div>
</template>

<style lang="scss" scoped>
  .tab {
    display: flex;
    height: 100%;
    flex-direction: row;
    align-items: center;
    user-select: none;
    font-size: 95%;
    width: 150px;
    margin-right: 2px;
    cursor: pointer;
    padding: 0 10px;
    span {
      text-align: center;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow-x: hidden;
      margin-right: 5px;
      flex-grow: 1;
    }

    img {
      height: 75%;
      width: auto;
      background-color: transparent;
    }
  }
</style>
