<template>
  <el-row :gutter="20">
    <!--  ocr  -->
    <el-col :span="8">
      <el-card
        :body-style="{ padding: '0px' }"
        @click="routerJump('/text-rec')"
      >
        <img src="./img/ocr.jpg" class="image" />
        <div style="padding: 14px">
          <h2>OCR图像中文本识别</h2>
          <div>
            基于ocr文本区域检测模型，可框选通用文本字符（中文、英文、数字）所在区域。
          </div>
        </div>
      </el-card>
    </el-col>
    <!--  ocrdet  -->
    <el-col :span="8">
      <el-card
        :body-style="{ padding: '0px' }"
        @click="routerJump('/text-det')"
      >
        <img src="./img/ocrdet.jpg" class="image" />
        <div style="padding: 14px">
          <h2>OCR图像中文本检测</h2>
          <div>
            基于ocr文本区域检测模型，可框选通用文本字符（中文、英文、数字）所在区域。
          </div>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { routerJump } from "@/utils/routerJump";
</script>

<style scoped lang="less">
img {
  width: 100%;
  height: 200px;
  background-position: center center;
}
</style>
