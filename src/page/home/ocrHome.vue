<template class="home-page">
  <div>
      <!-- 主体框架 -->
      <div class = 'content-container'>
          <!-- 登录-->
            <div class="content serach-content">
          <div class="title">
            <p class="fir-line">OCR分子结构提取</p>
          </div>
          <div class="ipt">
            <div class="ipt-container">
              <span class="ipt-button">选择文件
                <input type="file" class="file-show" value="选取文件" ref="input_file"  @change = "inputChange"/>
              </span>
                <input class="input_file" ref="ipt" v-model="input_file"  @keyup.enter = "showOCR" placeholder ="选择PDF/JPG格式文件"/>
           
               <span class="icon-serach" v-on:click="showOCR"></span>
            </div>
          </div>
        </div>
      </div>
  </div>

</template>

<script>
  import axios from 'axios';

  export default {
    name: 'ocrHome',
    data() {
    
      return{
        input_file:'',
        file:[]
      }

    },
    mounted() {

    
    },
   
    methods:{

      inputChange(){
        if(this.$refs.input_file.files[0]!=null){
        this.file=this.$refs.input_file.files[0];
        this.input_file=this.file.name;
        }
      },
      showOCR(){
        let file=this.file;
        let name = file.name;
        let _this = this;

        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend  = (e) => {
            let base64 = e.target.result
            axios({
            url: '/api/v1/get_pictures/',
            method: 'post',
            data: {
                file_name: name,
                data: base64.split(',')[1],
            },
            headers: {
                'content-type': 'application/json', // 默认值
            },
            }).then((res) => {
            //logger.info('4!');
            console.log(res.data)
            this.$store.commit('setData', res.data);
            this.$router.push('/ocr/readPDF')
            }).catch((err) => {
            this.$message({
                showClose: true,
                message: err,
                type: 'error'
            });
            });
        
        };

      },

    }
     
  }
</script>

<style lang="scss" scoped>
  .home-page{
    width: 100%;
  }
  .content-container{
    width: 100%;
    height: 600px;
    background-image: url("/static/img/form-back.jpg");
    background-size: 100% auto;
  }
  
  .serach-content{
    padding-top: 150px;
    .fir-line{
      color: black;
      font-size: 30px;
      letter-spacing:5px;
    }
    .sec-line{

      color: #fff;
      font-size: 18px;
      padding-top: 15px;
      font-weight: lighter;
      letter-spacing:4px;
    }
    .target-choose{
      width:400px;
      margin: auto;
     // 需要修改
    }

    .ipt-button{
    padding: 10px 10px;
    height: 40px;
    width:80px;
    line-height: 20px;
    position: relative;
    border: 1px solid #999;
    text-decoration: none;
    color: white;
    float:left;
    font-size:16px;
    background-color: rgb(47, 138, 219);
      .file-show{
        position: absolute;
        overflow: hidden;
        right: 0;
        top: 0;
        opacity: 0;
      }
    }
    
    .ipt{
      width:500px;
      height: 45px;
      margin: auto;
      margin-top: 50px;
      margin-bottom: 30px;
      .ipt-container{
        width:500px;
        height: 45px;
        border-radius: 35px;
        border:2px solid #3d93de;
        background: #fff;
        overflow: hidden;
        position: relative;
        input{
          width:100px;
          height: 45px;
          line-height: 52px;
          font-size: 20px;
          padding-left: 30px;
          text-align: left;
          display: block;
        }
        .input_file{
          width:300px;
        }
        .icon-serach{
          clear: both;
          width:38px;
          height: 38px;
          background: url("../../assets/img/icon-serach.png") 0 0 no-repeat;
          background-size: cover;
          position: absolute;
          right:12px;
          top: 3px;
          cursor: pointer;
        }
      }
    }
    
  }
    

</style>
