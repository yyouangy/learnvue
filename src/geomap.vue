<template>
  <div class="container">
    <div ref="mapChart" id="mapChart" class="mapChart"></div>

    <div class="leftWrapper" v-show="showDacLineData">
      <div>
        <div class="left-tool-box">
          <div class="left-tool-item">展开全部</div>
          <div class="left-tool-item" style="margin-left:10px">折叠全部</div>
          <div class="left-tool-close">
            <img
              src="../../assets/images/closex.png"
              alt
              width="28px"
              height="14px"
              @click="closeLeftDialog"
            />
          </div>
        </div>

        <div class="left-content-title-box">
          <div class="left-content-title">大馈线供电路径设备清单</div>
          <div class="left-content-title">瓦子村3社</div>
        </div>
        
        <div class="left-content-data-item-box">
          <div class="left-content-data-item">
            <img
              style="margin-right:5px"
              src="../../assets/images/plus.png"
              alt
              width="14px"
              height="14px"
            />
            <div>供电路径</div>
          </div>
        </div>

        <div class="left-content-data-item-box">
          <div class="left-content-data-item">
            <img
              style="margin-right:5px"
              src="../../assets/images/plus.png"
              alt
              width="14px"
              height="14px"
            />
            <div>断路器</div>
          </div>
        </div>

        <div class="left-content-data-item-box">
          <div class="left-content-data-item">
            <img
              style="margin-right:5px"
              src="../../assets/images/plus.png"
              alt
              width="14px"
              height="14px"
            />
            <div>配网母线</div>
          </div>
        </div>

        <div class="left-content-data-item-box">
          <div class="left-content-data-item">
            <img
              style="margin-right:5px"
              src="../../assets/images/minus.png"
              alt
              width="14px"
              height="14px"
            />
            <div>隔离开关</div>
          </div>
        </div>
        <div class="left-content-data-item-detail">
          <div class="left-content-data-item-detail-item">
            <div class="left-content-data-item-detail-item-log"></div>
            <div>10kV南津线11#杆柱上隔离开关</div>
          </div>
          <div class="left-content-data-item-detail-item">
            <div class="left-content-data-item-detail-item-log"></div>
            <div>10kV南津线#1柱上开关</div>
          </div>
          <div class="left-content-data-item-detail-item">
            <div class="left-content-data-item-detail-item-log"></div>
            <div>10kV南津线#1-1刀闸</div>
          </div>
        </div>

        <div class="left-content-data-item-box">
          <div class="left-content-data-item">
            <img
              style="margin-right:5px"
              src="../../assets/images/plus.png"
              alt
              width="14px"
              height="14px"
            />
            <div>配网导线</div>
          </div>
        </div>

        <div class="left-content-data-item-box">
          <div class="left-content-data-item">
            <img
              style="margin-right:5px"
              src="../../assets/images/plus.png"
              alt
              width="14px"
              height="14px"
            />
            <div>熔断器</div>
          </div>
        </div>
      </div>
    </div>

    <div v-show="showStationData" class="leftWrapperWithSearch">
      <div class="left-search-box">
        <input class="left-search-input" placeholder="请输入搜索内容" />
        <div class="left-search-button">
          <img src="../../assets/images/search.png" alt width="18px" height="18px" />
        </div>
      </div>
      <div class="left-data-wrapper">
        <div class="left-data-tab-box">
          <!-- 基础信息 -->
          <div
            :class="{'left-data-tab-selected':tabIdx == 1,'left-data-tab-unselected':tabIdx !=1}"
            @click="tabSelect(1)"
          >基础信息</div>

          <!-- 供电路径 -->
          <div
            :class="{'left-data-tab-selected':tabIdx == 2,
                      'left-data-tab-unselected':tabIdx !=2,
                      'left-radius':leftRadius,
                      'right-radius':rightRadius}"
            @click="tabSelect(2)"
          >
            <div class="left-data-tab-split" style="right:268px" v-show="tabIdx == 3"></div>
            <div class="way">供电路径</div>
            <div class="left-data-tab-split" v-show="tabIdx == 1"></div>
          </div>

          <!-- 供电区域 -->
          <div
            :class="{'left-data-tab-selected':tabIdx == 3,'left-data-tab-unselected':tabIdx !=3}"
            @click="tabSelect(3)"
          >供电区域</div>
        </div>

        <div class="left-data-container">
          <div class="left-data-pic-box">
            <div>
              <img src="../../assets/images/sample.png" alt width="100%" height="100%" />
            </div>

            <div class="left-data-pic-remaks">
              <div class="left-data-pic-remaks-place">
                <div style="padding-right:35px">龙王</div>
                <div>(500KV)</div>
              </div>
              <div class="left-data-pic-remaks-position">
                <div>经度：104.2391</div>
                <div style="margin-left:20px">纬度：30.684</div>
              </div>
            </div>
          </div>

          <div class="left-data-station-img" @click="showStaMap">场站图</div>

          <div class="equipmentInfo">
            <el-collapse>
              <el-collapse-item
                @click.native="changeIcon(item)"
                v-for="(item,index) in equipInfo"
                :key="index"
                ref="collapseItem"
              >
                <template slot="title">
                  <img
                    v-if="item.isCollapse"
                    style="margin-right:5px"
                    src="../../assets/images/plus.png"
                    alt
                    width="14px"
                    height="14px"
                  />
                  <img
                    v-else
                    style="margin-right:5px"
                    src="../../assets/images/minus.png"
                    alt
                    width="14px"
                    height="14px"
                  />
                  <span>{{rtName[Object.keys(item)[0]]}}</span>
                </template>
                <div
                  v-for="item in Object.values(item)[0]"
                  :key="item.v_id"
                  @click.stop="showEquipState(item)"
                >
                  <span class="circle"></span>
                  {{item.attributes.NAME}}
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </div>
      </div>
    </div>
    <!-- 场站图 -->
    <div v-show="showStationMap" class="stationMap">
      <div class="head">
        <span class="name">场站图</span>
        <img src="../../imgs/close3.png" @click="closeStaMap" alt />
      </div>
      <div class="main">
        <div class="picture">图片</div>
        <div class="table">
          <div class="table-row-group">
            <ul class="table-row">
              <li class="table-cell" style="color: #fff">属性</li>
              <li class="table-cell">值</li>
            </ul>
            <ul class="table-row">
              <li class="table-cell">Topo ID</li>
              <li class="table-cell">属性</li>
            </ul>
            <ul class="table-row">
              <li class="table-cell">图符</li>
              <li class="table-cell"></li>
            </ul>
            <ul class="table-row">
              <li class="table-cell">标签</li>
              <li class="table-cell">CN#123654654</li>
            </ul>
            <ul class="table-row">
              <li class="table-cell">颜色</li>
              <li class="table-cell"></li>
            </ul>
            <ul class="table-row">
              <li class="table-cell">出厂编号</li>
              <li class="table-cell"></li>
            </ul>
            <ul class="table-row">
              <li class="table-cell">元件信息</li>
              <li class="table-cell"></li>
            </ul>
            <ul class="table-row">
              <li class="table-cell">元件信息</li>
              <li class="table-cell">双堰110KV ｜ 母线</li>
            </ul>
            <ul class="table-row">
              <li class="table-cell">电压等级</li>
              <li class="table-cell">110</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- 设备情况概览 -->
    <div v-show="showEquipmentState" class="equipmentState">
      <div class="head2">
        <span class="name2">设备情况概览</span>
        <img src="../../imgs/close3.png" @click="closeEquipState" alt />
      </div>
      <!-- 表格背景框 -->
      <div class="content">
        <div class="row">
          <div class="row-item">
            <span class="title">设备编号：</span>
            <span class="info">
              {{this.obj.v_id}}
            </span>
          </div>
          <div class="row-item">
            <span class="title">设备名称：</span>
            <span class="info"></span>
          </div>
        </div>
        <div class="row">
          <div class="row-item">
            <span class="title">设备类型：</span>
            <span class="info">{{this.obj.v_type}}</span>
          </div>
          <div class="row-item">
            <span class="title">型</span>
            <span class="title" style="margin-left:-52px">号：</span>
            <span class="info" style="margin-left:-48px">500KV</span>
          </div>
        </div>
        <div class="row">
          <div class="row-item">
            <span class="title">运行状态：</span>
            <span class="info">500KV</span>
          </div>
          <div class="row-item">
            <span class="title">电压等级：</span>
            <span class="info"></span>
          </div>
        </div>
        <div class="row">
          <div class="row-item">
            <span class="title">所属地调：</span>
            <span class="info">510100</span>
          </div>
          <div class="row-item">
            <span class="title">所属变电站：</span>
            <span class="info"></span>
          </div>
        </div>
        <div class="row">
          <div class="row-item">
            <span class="title">生产厂家：</span>
            <span class="info"></span>
          </div>
          <div class="row-item">
            <span class="title">投运时间：</span>
            <span class="info"></span>
          </div>
        </div>
        <div class="row">
          <span class="title">缺陷记录：</span>
          <span class="info"></span>
        </div>
        <div class="row">
          <span class="title">故障记录：</span>
          <span class="info"></span>
        </div>
      </div>
    </div>

    <div class="rightWarp">
      <div class="tip-item">
        <img src="../../assets/images/500kv-station.png" alt />
        <label style="color:black">500KV变电站</label>
      </div>
      <div class="tip-item">
        <img src="../../assets/images/220kv-station.png" alt />
        <label>220KV变电站</label>
      </div>

      <div class="tip-item">
        <img src="../../assets/images/110kv-station.png" alt />
        <label>110KV变电站</label>
      </div>
      <div class="tip-item" style="cursor: pointer">
        <img src="../../assets/images/10kv-station.png" alt />
        <label>10KV配电室</label>
      </div>
      <div class="tip-item">
        <img src="../../assets/images/VIP.png" alt />
        <label>重要用户</label>
      </div>
      <div class="tip-item">
        <img src="../../assets/images/huodian.png" alt />
        <label>火电厂</label>
      </div>
    </div>
    <right-menu
      :x="rightMenuX"
      :y="rightMenuY"
      v-show="showRightMenu"
      @showScope="getMsgFromSon"
      @showNextNode="getNextNode(eachId)"
    />
  </div>
</template>
<script>
import myOptionCfg from "../data/my-option-config";
import * as http from "./../../service/geographyMap/geographyMap.js";
import axios from "../../config/http";
import rightMenu from "../../components/rightMenu";
import { log } from "util";

export default {
  data() {
    return {
      bigeChart: null,
      map: "",
      showDacLineData: true,
      showStationData: false,
      tabIdx: 1,
      showStationMap: false,
      showEquipmentState: false,
      showRightMenu: false,
      rightMenuX: 0,
      rightMenuY: 0,
      leftRadius: true,
      rightRadius: false,
      msgFromSon: false,
      dispointsArr: [],
      activeNames: ["1"],
      res: [],
      equipInfo: [],
      rtName: {
        subGrounddis: "接地刀闸",
        "@@PT": "电压互感器",
        subDis: "隔离开关",
        subBeaker: "断路器",
        subTransfmwd: "变压器绕组",
        subPwrtransfm: "变压器",
        "@@SHUNTREACTOR": "并联电抗器",
        "@@SHUNTCAPASITOR": "并联电容器", // SHUNTCAPACITOR
        "@@SVC": "SVC",
        "@@SVG": "SVG",
        "@@BUS": "母线", // BUSBAR
        "@@ACLINEEND": "交流线端",
        subAcline: "交流线路",
        "@@SERIESREACTOR": "串联电抗器",
        subGenerator: "发电机",
        "@@L_OAD": "负荷",
        "@@TLINEEND": "T接线端",
        "@@TNODE": "T接点",
        "@@TLINE": "T接线路",
        DBREAKERMAIN: "断路器",
        subBusBar: "母线",
        DDISMAIN: "隔离开关",
        DTRANSMAIN: "变压器绕组",
        DWIREMAIN: "线",
        DGROUNDDISMAIN: "接地刀闸",
      },
      eachId: [],
      obj:{},
    };
  },
  components: {
    rightMenu,
  },

  mounted() {
    document.oncontextmenu = function () {
      return false;
    };
    this.initMap();
    this.get500KVpoint();
    let myOption = myOptionCfg.option;

    this.map.on("zoomend", (params) => {
      // console.log(this.map.getCenter());
      // let center = this.map.getCenter();
      // this.map.setView(center);

      if (params.target._zoom >= 10 && params.target._zoom <= 11) {
        myOption.series = [];
        this.bigeChart = BM.supermap.echartsLayer(myOption).addTo(this.map);
        this.bigeChart.getEcharts().on("contextmenu", (params) => {
          // console.log(params);
          this.rightMenuX = params.event.offsetX;
          this.rightMenuY = params.event.offsetY;
          this.rightMenu();
        });
        this.get220KVpoint();
        this.get500to220line();
        this.get110KVpoint();
        this.get220to110line();
      } else if (params.target._zoom >= 14 && params.target._zoom < 15) {
        console.log(params.target._zoom);
        myOption.series = [];
        var oldbounds = this.map.getBounds();
        var bounds = {
          southWest: {
            lat: oldbounds._southWest.lat,
            lng: oldbounds._southWest.lng,
          },
          northEast: {
            lat: oldbounds._northEast.lat,
            lng: oldbounds._northEast.lng,
          },
        };
        http.getBoundsData(bounds).then((res) => {
          this.bigeChart.remove();
          myOption.series = [];
          let lightPoint = myOptionCfg.lightPoint;
          let lightLine = myOptionCfg.lightLine;
          lightPoint.data = res.point;
          console.log(res.point);
          myOption.series.push(lightPoint);
          lightLine.data = res.dacline;
          myOption.series.push(lightLine);
          this.bigeChart = BM.supermap.echartsLayer(myOption).addTo(this.map);
        });
        this.map.on("dragend", (params) => {
          let center = this.map.getCenter();
          this.map.setView(center);
          // myOption.series = [];
          var oldbounds = this.map.getBounds();
          // console.log(oldbounds);
          var bounds = {
            southWest: {
              lat: oldbounds._southWest.lat,
              lng: oldbounds._southWest.lng,
            },
            northEast: {
              lat: oldbounds._northEast.lat,
              lng: oldbounds._northEast.lng,
            },
          };
          http.getBoundsData(bounds).then((res) => {
            this.bigeChart.remove();
            myOption.series = [];
            let lightPoint = myOptionCfg.lightPoint;
            let lightLine = myOptionCfg.lightLine;
            lightPoint.data = res.point;
            console.log(res.point);
            myOption.series.push(lightPoint);
            lightLine.data = res.dacline;
            myOption.series.push(lightLine);
            this.bigeChart = BM.supermap.echartsLayer(myOption).addTo(this.map);
          });
        });
        this.bigeChart.getEcharts().on("contextmenu", (params) => {
          console.log(params);
          this.rightMenuX = params.event.offsetX;
          this.rightMenuY = params.event.offsetY;
          this.rightMenu();
        });
        if (params.target._zoom >= 11 && params.target._zoom < 12) {
          this.bigeChart.remove();
          this.get220KVpoint();
          this.get500to220line();
          this.get110KVpoint();
          this.get220to110line();
        }
      }
    });

    this.map.on("mousedown", () => {
      this.showRightMenu = false;
    });

    this.map.on("zoomend", (params) => {
      // console.log(params.target._zoom);
      if (params.target._zoom !== 10.1) {
        this.showRightMenu = false;
      }
    });
    // this.getDisPoints();
    this.getNextNode();
  },

  methods: {
    initMap() {
      BM.Config.HTTP_URL = "http://192.168.8.64:9000";
      this.map = BM.map("mapChart", "bigemap.375of5y9", {
        center: [39.813146, 119.0],
        zoom: 10,
        zoomControl: false,
        attributionControl: false,
      });
      let myOption = myOptionCfg.option;
      myOption.series = [];
      this.bigeChart = BM.supermap.echartsLayer(myOption).addTo(this.map);
      myOption.tooltip = {
        backgroundColor: "rgba(15,162,142,1)",
        position: function (point, params, dom, rect, size) {
          return point;
        },
        formatter: function (params) {
          // console.log(params);
          var item = params.data;
          var subName = item.subName.split(".").reverse()[0];
          var html =
            '<div style="display: flex;flex-direction: column;padding:10px"><div style="font-weight: bold;margin-bottom: 5px;">' +
            subName +
            "</div>";
          return html;
        },
      };
      this.bigeChart.getEcharts().on("contextmenu", (params) => {
        // console.log(params);
        this.rightMenuX = params.event.offsetX;
        this.rightMenuY = params.event.offsetY;
        this.rightMenu();
      });

      this.bigeChart.getEcharts().on("click", (params) => {
        this.clickNodeMenu(params);
      });
    },
    rightMenu() {
      this.showRightMenu = true;
    },
    get500KVpoint() {
      http.getSubsOf500KV(500).then((res) => {
        console.log(res);
        let arr = [];
        res.forEach((m) => {
          arr.push(m.name);
        });
        console.log(arr);
        this.eachId = arr;

        console.log(this.eachId);
        let myOption = myOptionCfg.option;
        myOption.series = [];
        let lightPoint = myOptionCfg.lightPoint;
        lightPoint.data = res;
        myOption.series.push(lightPoint);

        this.bigeChart = BM.supermap.echartsLayer(myOption).addTo(this.map);
        this.bigeChart.getEcharts().on("click", (params) => {
          this.clickNodeMenu(params);
        });
        this.bigeChart.getEcharts().on("contextmenu", (params) => {
          // console.log(params);
          this.rightMenuX = params.event.offsetX;
          this.rightMenuY = params.event.offsetY;
          this.rightMenu();
        });
      });
    },
    get220KVpoint() {
      http.getSubsOf220KV(220).then((res) => {
        let myOption = myOptionCfg.option;
        myOption.series = [];
        let lightPoint = myOptionCfg.lightPoint;
        lightPoint.data = res;
        myOption.series.push(lightPoint);
        this.bigeChart = BM.supermap.echartsLayer(myOption).addTo(this.map);
        this.bigeChart.getEcharts().on("click", (params) => {
          console.log(params);
          this.clickNodeMenu(params);
        });
        this.bigeChart.getEcharts().on("contextmenu", (params) => {
          // console.log(params);
          this.rightMenuX = params.event.offsetX;
          this.rightMenuY = params.event.offsetY;
          this.rightMenu();
        });
      });
    },
    get110KVpoint() {
      http.getSubsOf110KV(110).then((res) => {
        let myOption = myOptionCfg.option;
        myOption.series = [];
        let lightPoint = myOptionCfg.lightPoint;
        lightPoint.data = res;
        myOption.series.push(lightPoint);
        this.bigeChart = BM.supermap.echartsLayer(myOption).addTo(this.map);
        this.bigeChart.getEcharts().on("click", (params) => {
          this.clickNodeMenu(params);
        });
        this.bigeChart.getEcharts().on("contextmenu", (params) => {
          // console.log(params);
          this.rightMenuX = params.event.offsetX;
          this.rightMenuY = params.event.offsetY;
          this.rightMenu();
        });
      });
    },
    get500to220line() {
      http.getAclineList("500To220").then((res) => {
        // console.log(res);
        let myOption = myOptionCfg.option;
        myOption.series = [];
        let lightLine = myOptionCfg.lightLine;
        lightLine.data = res;
        myOption.series.push(lightLine);
        this.bigeChart = BM.supermap.echartsLayer(myOption).addTo(this.map);
        this.bigeChart.getEcharts().on("click", (params) => {
          this.clickNodeMenu(params);
        });
      });
    },
    get220to110line() {
      http.getAclineList("220To110").then((res) => {
        let myOption = myOptionCfg.option;
        myOption.series = [];
        let lightLine = myOptionCfg.lightLine;
        lightLine.data = res;
        myOption.series.push(lightLine);
        this.bigeChart = BM.supermap.echartsLayer(myOption).addTo(this.map);
        this.bigeChart.getEcharts().on("click", (params) => {
          this.clickNodeMenu(params);
        });
      });
    },
    //点击显示供电范围
    getMsgFromSon(data) {
      if (data) {
        let myOption = myOptionCfg.option;
        // console.info("myOption", myOption);
        myOption.series = [];
        let lightPoint = myOptionCfg.lightPoint;
        lightPoint.data = this.dispointsArr;
        console.log(lightPoint.data);
        myOption.series.push(lightPoint);
        // this.getDaclineList();
        BM.supermap.echartsLayer(myOption).addTo(this.map);
      }
    },
    //点击显示下层节点
    getNextNode(eachId) {
      console.log(eachId); //undefined

      // let name = 0;
      // eachId.forEach((m) => {
      //   name = m;
      // });
      // console.log(name);
      // http.getSubNodeById(id).then((res) => {
      //   console.log(res);
      // });
    },
    //获取10KV配电室
    // getBoundsData() {
    //   http.getBoundsData().then((res) => {
    //   // console.log(res);
    //   let myOption = myOptionCfg.option;
    //   myOption.series = [];
    //   let lightPoint = myOptionCfg.lightPoint;
    //   // let n = 0;
    //   // res.forEach((m) => {
    //   //   m.daclineList.forEach((v) => {
    //   //     n = n + (v.dksList ? v.dksList.length : 0);
    //   //   });
    //   // });
    //   // console.log(n);
    //   let arr2 = [];
    //   // 全量数据
    //   res.forEach((n) => {
    //     n.daclineList.forEach((m) => {
    //       // arr2 = [];
    //       arr2 = arr2.concat(m.dksList || []);
    //     });
    //   });
    //   this.dispointsArr = arr2;
    //   lightPoint.data = arr2;
    //   console.log(arr2);

    //     myOption.series.push(lightPoint);
    //     this.bigeChart = BM.supermap.echartsLayer(myOption).addTo(this.map);
    //     this.bigeChart.getEcharts().on("click", (params) => {
    //       this.clickNodeMenu(params);
    //     });
    //   });
    //   this.getMsgFromSon();
    // },
    //获取220KV变电站和10KV配电室的连线
    get220DaclineList() {
      http.getDaclineList(220).then((res) => {
        let myOption = myOptionCfg.option;
        myOption.series = [];
        let lightLine = myOptionCfg.lightLine;
        lightLine.data = res;
        myOption.series.push(lightLine);

        this.bigeChart = BM.supermap.echartsLayer(myOption).addTo(this.map);
        this.bigeChart.getEcharts().on("click", (params) => {
          this.clickNodeMenu(params);
        });
      });
      this.getMsgFromSon();
    },
    //获取110KV变电站和10KV配电室的连线
    get110DaclineList() {
      http.getDaclineList(110).then((res) => {
        let myOption = myOptionCfg.option;
        myOption.series = [];
        let lightLine = myOptionCfg.lightLine;
        lightLine.data = res;
        myOption.series.push(lightLine);

        this.bigeChart = BM.supermap.echartsLayer(myOption).addTo(this.map);
        this.bigeChart.getEcharts().on("click", (params) => {
          this.clickNodeMenu(params);
        });
      });
    },
    clickNodeMenu(params) {
      console.log(params);
      if (params.data.subType == 1003) {
        http.getSubEquById("1").then((res) => {
          console.log(res);
          // this.res=res;
          this.equipInfo = (res.results || []).map((m) => ({
            ...m,
            isCollapse: true,
          }));
        });
      }

      this.showStationData = true;
    },

    closeLeftDialog() {
      this.showDacLineData = false;
      this.showStationData = true;
    },

    tabSelect(idx) {
      if (idx == 1) {
        this.leftRadius = true;
        this.rightRadius = false;
      } else if (idx == 3) {
        this.leftRadius = false;
        this.rightRadius = true;
      }
      if (this.tabIdx == idx) {
        return;
      } else {
        this.tabIdx = idx;
      }
    },
    showStaMap() {
      this.showStationMap = true;
    },
    closeStaMap() {
      this.showStationMap = false;
    },
    showEquipState(item) {
      this.obj=item;
      console.log(this.obj);
      this.showEquipmentState = true;
    },
    closeEquipState() {
      this.showEquipmentState = false;
    },
    handleChange(val) {
      console.log(val);
    },
    changeIcon(item) {
      item.isCollapse
        ? this.$set(item, "isCollapse", false)
        : this.$set(item, "isCollapse", true);
      // var title = document.querySelector(".el-collapse-item");
      // if (!item.collapse) {
      // console.log(this.$refs.collapseItem);
      // }
    },
  },
};
</script>
<style lang='scss' scoped>
.equipmentInfo {
  height: 300px;
  overflow: scroll;
  .el-collapse {
    .el-collapse-item {
      border-bottom: 1px solid #17354e;
      padding-top: 5px;
      div:first-of-type {
        border-top: 1px solid #17354e;
      }
      div:last-of-type {
        padding-bottom: 20px;
      }
      div {
        background-color: #e3f2ef;
        cursor: pointer;
        .circle {
          border-radius: 50%;
          width: 18px;
          height: 18px;
          margin-right: 5px;
          border: 4px solid #5b70aa;
          transform: translateY(13px);
          margin-left: 25px;
        }
      }
      img {
        margin-top: 10px;
      }
      span {
        display: inline-block;
        margin-bottom: 10px;
        margin-top: 10px;
        letter-spacing: 1px;
      }
    }
  }
  .active {
    border-bottom: none;
    // background-color: red;
    img {
      content: url("../../assets/images/minus.png");
    }
    .hide-border {
      .el-collapse-item {
        border: none;
      }
    }
  }
}

/deep/ :focus {
  outline: 0;
}
.container {
  font-family: "Microsoft YaHei", 微软雅黑, "MicrosoftJhengHei", 华文细黑,
    STHeiti, MingLiu;
  width: 100%;
  height: 100%;
}

.mapChart {
  width: 100%;
  height: 100%;
}

// 场站图
.stationMap {
  z-index: 9;
  width: 1045px;
  height: 744px;
  background: #fbf8f8;
  box-shadow: 0 0 6px 0 rgba(19, 75, 163, 0.3);
  margin-left: 550px;
  margin-top: -800px;
  display: flex;
  flex-direction: column;
  .head {
    .name {
      display: inline-block;
      width: 350px;
      padding-left: 45px;
      margin-top: 15px;
      font-size: 22px;
      color: #3a3a3a;
      letter-spacing: 0;
      padding-bottom: 10px;
      font-weight: bold;
      border-bottom: 3px solid #4c9396;
    }
    img {
      display: block;
      font-weight: bold;
      width: 24px;
      height: 25px;
      float: right;
      margin-right: 15px;
      margin-top: 15px;
      cursor: pointer;
    }
  }
  .main {
    display: flex;
    .picture {
      width: 444px;
      height: 623px;
      background-color: #000;
      margin-left: 45px;
      margin-top: 20px;
      font-size: 22px;
      color: #93a5ce;
      letter-spacing: 0;
      text-align: center;
      line-height: 623px;
      font-weight: bold;
    }
  }
}
.table {
  display: table;
  border-collapse: collapse;
  border: 1px solid #676767;
  width: 481px;
  height: 600px;
  margin-left: 15px;
  margin-top: 30px;
}
.table-row-group {
  display: table-row-group;
  background: rgb(245, 245, 245);
  color: #134ba3;
  font-size: 16px;
  letter-spacing: 0;
}
ul:first-of-type {
  background: #4c9396;
  color: #fff;
}
ul li:first-of-type {
  width: 187px;
  color: #000;
}
.table-row,
.table-row2 {
  display: table-row;
  line-height: 65px;
}
.table-cell {
  display: table-cell;
  padding: 0 35px;
  border: 1px solid #676767;
}
// 设备情况概览
.equipmentState {
  z-index: 9;
  width: 1045px;
  height: 608px;
  background: rgb(255, 255, 255);
  box-shadow: 0 0 6px 0 rgba(19, 75, 163, 0.3);
  margin-left: 550px;
  margin-top: -700px;
  display: flex;
  flex-direction: column;
  text-align: justify;
  .head2 {
    .name2 {
      display: inline-block;
      width: 350px;
      padding-left: 45px;
      margin-top: 15px;
      font-size: 22px;
      color: #3a3a3a;
      letter-spacing: 0;
      padding-bottom: 10px;
      font-weight: bold;
      border-bottom: 3px solid #4c9396;
    }
    img {
      display: block;
      font-weight: bold;
      width: 24px;
      height: 25px;
      float: right;
      margin-right: 15px;
      margin-top: 15px;
      cursor: pointer;
    }
  }
  .content {
    // margin: 100px auto 0;
    margin: auto;
    padding-top: 18px;
    width: 953px;
    height: 491px;
    background-color: rgb(245, 245, 245);
    .row {
      margin: 0 auto;
      width: 916px;
      border-bottom: 1px solid #676767;
      border-left: 1px solid #676767;
      border-right: 1px solid #676767;
      display: flex;
      height: 65px;
      &:first-child {
        border-top: 1px solid #676767;
      }
      .row-item {
        flex: 1;
        height: 100%;
        display: flex;
        align-items: center;
        overflow: hidden;
        &:first-child {
          border-right: 1px solid #676767;
        }
      }
      span {
        display: inline-block;
        // text-align-last: left;
        height: 100%;
        line-height: 65px;
      }

      .title {
        width: 100px;
        margin-left: 35px;
        color: #3a3a3a;
        font-weight: bold;
      }

      .info {
        flex: 1;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        color: #134ba3;
      }
    }
  }
}

.rightWarp {
  position: absolute;
  right: 10px;
  bottom: 50px;
  z-index: 99999;
  padding: 10px;
  display: flex;
  flex-direction: column;
  background: rgba(0, 0, 0, 0.3);
  width: 184px;
  height: 224px;
  .tip-item {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    margin-top: 10px;
    color: #3a3a3a;
  }
  .tip-item img {
    width: 20px;
    height: 20px;
  }
  .tip-item label {
    margin-left: 10px;
    font-size: 14px;
    color: #3a3a3a;
  }
}

.leftWrapperWithSearch {
  position: absolute;
  left: 20px;
  top: 94px;
  width: 403px;
  height: 83%;

  display: flex;
  flex-direction: column;

  .left-search-box {
    width: 100%;
    height: 35px;
    display: flex;
    flex-direction: row;
    background: #dcf2ee;
    border: 1px solid rgba(40, 82, 108, 0.56);
    padding-left: 8px;
  }

  .left-search-input {
    width: 335px;
    background: #dcf2ee;
  }

  .left-search-button {
    background: #006569;
    width: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }

  .left-data-wrapper {
    width: 100%;
    height: 100%;
    background: #ffffff;
    box-shadow: 0 0 6px 0 rgba(19, 75, 163, 0.3);
    margin-top: 20px;
    // padding: 0 10px 10px 10px;
    display: flex;
    align-content: flex-start;
    flex-direction: column;
  }

  .left-data-tab-box {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: 42px;
    font-size: 14px;
  }

  .left-data-tab-selected {
    background-color: white;
    color: #3a3a3a;
    text-align: center;
    width: 135px;
    height: 42px;
    line-height: 42px;
    cursor: pointer;
  }

  .left-data-tab-unselected {
    background: #006569;
    color: #e4edff;
    width: 135px;
    text-align: center;
    height: 42px;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
  .left-radius {
    border-radius: 0 0 0 10px;
  }
  .right-radius {
    border-radius: 0 0 10px 0;
  }

  .left-data-tab-split {
    position: absolute;
    right: 134px;
    font-weight: bold;
  }

  .left-data-container {
    padding: 15px;
  }

  .left-data-pic-box {
    height: 333px;
    width: 100%;
  }

  .left-data-pic-remaks {
    position: absolute;
    top: 334px;
    background: rgba(0, 0, 0, 0.7);
    height: 108px;
    width: 373px;
    color: white;

    padding: 25px 30px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }

  .left-data-pic-remaks-place {
    display: flex;
    flex-direction: row;
    font-size: 22px;
  }

  .left-data-pic-remaks-position {
    display: flex;
    flex-direction: row;
    margin-top: 10px;
  }

  .left-data-station-img {
    background: #006569;
    border-radius: 2px;
    width: 100%;
    height: 36px;
    color: white;
    line-height: 36px;
    font-size: 14px;
    text-align: center;
    margin-top: 15px;
    margin-bottom: 10px;
    cursor: pointer;
  }
}

.leftWrapper {
  position: absolute;
  left: 20px;
  top: 94px;
  width: 403px;
  height: 83%;
  background: #ffffff;
  box-shadow: 0 0 6px 0 rgba(19, 75, 163, 0.3);
  border-radius: 8px;

  padding: 15px 10px 10px 10px;

  display: flex;
  flex-direction: column;

  .left-tool-box {
    display: flex;
    flex-direction: row;
    justify-content: left;
    align-items: center;
    font-size: 14px;
    color: #3a3a3a;
    letter-spacing: 0;
  }

  .left-tool-item {
    height: 33px;
    width: 93px;
    border: 1px solid #124472;
    border-radius: 6px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
  .left-tool-close {
    position: absolute;
    right: 15px;
    cursor: pointer;
  }
}

.left-content-title-box {
  display: flex;
  flex-direction: column;
  background: #52c1ad;
  height: 88px;
  width: 100%;
  font-size: 14px;
  color: #ffffff;
  letter-spacing: 0;
  margin: 15px 0 10px 0;

  padding-left: 15px;
}

.left-content-title {
  margin-top: 15px;
}

.left-content-data-item-box {
  height: 40px;
  width: 100%;
  border-bottom: 1px solid #0f2769;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}

.left-content-data-item {
  font-size: 14px;
  color: #3a3a3a;
  letter-spacing: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.left-content-data-item-detail {
  background: rgba(82, 193, 173, 0.2);
  padding: 10px 20px 20px 20px;
  display: flex;
  flex-direction: column;
  font-size: 14px;
  color: #3a3a3a;
  letter-spacing: 0;
}

.left-content-data-item-detail-item {
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
}
</style>