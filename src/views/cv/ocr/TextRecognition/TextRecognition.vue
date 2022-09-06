<template>
  <el-row :gutter="20">
    <el-col :span="8">
      <el-row class="small-title">
        <h2>上传文本图片</h2>
      </el-row>
      <el-row>
        <input type="file" @change="uploadImg" />
      </el-row>
      <el-row>
        <img id="raw-img" />
      </el-row>
      <el-row></el-row>
    </el-col>
    <el-col :span="8">
      <div>3</div>
    </el-col>
    <el-col :span="8">
      <div>1</div>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
const uploadImg = (e: Event) => {
  const reader = new FileReader();
  const rawImg = document.getElementById("raw-img") as HTMLImageElement;

  try {
    const file = (e!.target as HTMLInputElement).files![0];
    reader.onload = () => {
      rawImg.src = URL.createObjectURL(file);
      console.log(e);
    };
    reader.readAsDataURL(file);
  } catch (e) {
    console.error(e);
  }
};
</script>

<style scoped lang="less">
.small-title {
  justify-content: space-between;
  align-items: center;
}
img {
  width: 100%;
}
</style>
