<template>
  <div class="container">
    <div class="reset">
      <button @click="reset">还原</button>
    </div>
    <div id="chartMap1" class="chartMap"></div>
    <div
      class="rightMenu"
      v-if="isShowMenu"
      :style="{ top: menuPosition.menuTop, left: menuPosition.menuLeft }"
    >
      <div
        class="rightItem"
        v-for="item in rightMenu"
        :key="item.name"
        @click="item.func"
      >
        <div>{{ item.name }}</div>
      </div>
    </div>
    <!-- 设备清单 -->
    <div class="leftWrapper" v-show="showLeftDialog">
      <div>
        <div class="left-tool-box">
          <div class="left-tool-item" @click="spreadAll">展开全部</div>
          <div class="left-tool-item" style="margin-left: 10px">折叠全部</div>
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
          <div class="left-content-title">大馈线供电路径设备清单：</div>
          <div class="left-content-title">{{ inLineNode[3] }}</div>
        </div>

        <div class="equipmentList">
          <el-collapse v-model="activeName">
            <el-collapse-item
              @click.native="changeIcon(item)"
              v-for="(item, index) in equipInfo"
              :key="index"
              ref="collapseItem"
            >
              <template slot="title">
                <img
                  v-if="item.isCollapse"
                  style="margin-right: 5px"
                  src="../../assets/images/plus.png"
                  alt
                  width="14px"
                  height="14px"
                />
                <img
                  v-else
                  style="margin-right: 5px"
                  src="../../assets/images/minus.png"
                  alt
                  width="14px"
                  height="14px"
                />
                <span>{{ rtName[Object.keys(item)[0]] }}</span>
              </template>
              <div
                v-for="item in Object.values(item)[0]"
                :key="item.v_id"
                @click.stop="showEquipState(item)"
              >
                <span class="circle"></span>
                {{ item.attributes.NAME }}
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
    </div>
    <!-- 供电路径 -->
    <div class="rightWrapper" v-show="showRightDialog">
      <div class="right-tab">
        <div class="right-tab-selected-item">
          <span>路径0</span>
        </div>
        <div class="right-tab-unselected-item">
          <span>路径0</span>
        </div>
      </div>
      <div class="right-tool-box">
        <div class="right-tool-item">展开全部</div>
        <div class="right-tool-item">折叠全部</div>
        <div class="right-tool-item">取消高亮</div>
      </div>
      <div class="right-content-title-box">
        <div class="right-content-title">{{ inLineNode[3] }}-供电路径</div>
      </div>
      <div class="powerLine">
        <el-collapse>
          <!-- 供电路径选项单独写 -->
          <el-collapse-item @click.native="changeIcon">
            <template slot="title">
              <img
                v-if="rightIsCollapse"
                style="margin-right: 5px"
                src="../../assets/images/plus.png"
                alt
                width="14px"
                height="14px"
              />
              <img
                v-else
                style="margin-right: 5px"
                src="../../assets/images/minus.png"
                alt
                width="14px"
                height="14px"
              />
              <span>供电路径</span>
            </template>
            <div>
              <span class="circle"></span>
              {{ inLineNode[3] }}
            </div>
            <div>
              <span class="circle"></span>
              {{ inLineNode[2] }}-110kV变电站
            </div>
            <div>
              <span class="circle"></span>
              {{ inLineNode[1] }}-220kV变电站
            </div>
            <div>
              <span class="circle"></span>
              {{ inLineNode[0] }}-500kV变电站
            </div>
          </el-collapse-item>
          <el-collapse-item
            @click.native="changeIcon"
            v-for="(item, index) in nodeLevel"
            :key="index"
          >
            <template slot="title">
              <img
                v-if="rightIsCollapse"
                style="margin-right: 5px"
                src="../../assets/images/plus.png"
                alt
                width="14px"
                height="14px"
              />
              <img
                v-else
                style="margin-right: 5px"
                src="../../assets/images/minus.png"
                alt
                width="14px"
                height="14px"
              />
              <span>{{ item }}</span>
            </template>
            <div @click="showEquipList">
              <span class="circle"></span>
              {{ inLineNode[index] }}
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
  </div>
</template>
<script>
import * as http from "./../../service/geographyMap/geographyMap.js";
import axios from "../../config/http";
// import myOption from "../data/my-gvi-config.js";
// import tdata from "../data/data-point.json";
import ldata from "../data/data-line.json";
import { log } from "util";
let echarts = require("echarts");
echarts.dataTool = require("echarts/extension/dataTool/index");
export default {
  data() {
    return {
      nodeLevel: ["500kV变电站", "220kV变电站", "110kV变电站", "大馈线"],
      activeName: [],
      rightIsCollapse: true,
      rightMenu: [],
      rightMenu1: [
        {
          name: "展示下层节点",
          func: this.showLowerNode,
        },
        {
          name: "显示供电路径",
          func: this.showPowerLine,
        },
        {
          name: "显示接线图",
          func: this.showDiagram,
        },
      ],
      menuPosition: {
        menuTop: "",
        menuLeft: "",
      },
      isShowMenu: false,
      rightClikeItem: [],
      nodes: [],
      links: [],
      pointLine: [],
      // myChart: null,
      option: {},
      arr11: [],
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
      equipInfo: [],
      showLeftDialog: false,
      showRightDialog: false,
      kv220Obj: {},
      kv35Obj: {},
      higherName: [],
      inLineNode: [],
      feedLinks: [],
      feedNodes: [],
      dataArr: [],
      kv110Obj:{}
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.getGviMap();
    });
  },
  methods: {
    pointFormat(data) {
      let vLevel = [1003, 1005, 1006, 1007, 1008];
      if (data) {
        return {
          category: vLevel.indexOf(data.subType),
          name: data.subName,
          id: data.name,
          x: data.value[0],
          y: data.value[1],
          draggable: false,
        };
      }
    },

    //处理力学图数据
    initChartOption(data, isAdd) {
      let vLevel = [1003, 1005, 1006, 1007, 1008];
      // 初始化点的数据
      let nodes = data.childSubList.map((item) => {
        return {
          category: vLevel.indexOf(item.subType),
          name: item.subName,
          id: item.name,
          x: item.value[0],
          y: item.value[1],
        };
      });
      // 初始化线的数据
      let links = data.aclineList.map((item) => {
        return {
          source: item.fromName,
          target: item.toName,
          lineStyle: {
            color: "#eb3323",
            width: 6,
            curveness: 0.1,
          },
        };
      });
      // 叠加数据
      if (isAdd && this.nodes) {
        nodes = this.contactNodeJson(nodes, this.nodes);
        links = this.contactLinkJson(links, this.links);
      }
      this.nodes = nodes;
      this.links = links;
      return [nodes, links];
    },

    // 点、线对象分别去重合并
    contactNodeJson(newJson, oldJson) {
      newJson = newJson.filter((newItem) => {
        return !oldJson.some((oldItem) => newItem.name === oldItem.name);
      });
      return [...newJson, ...oldJson];
    },
    contactLinkJson(newJson, oldJson) {
      newJson = newJson.filter((newItem) => {
        return !oldJson.some(
          (oldItem) =>
            newItem.source === oldItem.source &&
            newItem.target === oldItem.target
        );
      });
      return [...newJson, ...oldJson];
    },

    // 获取500kv变电站和他们之间的连线，初始化力学图
    async getGviMap() {
      this.pointLine = await http.getSubsOf500KV(500);
      this.nodes = [];
      this.links = [];
      let vLevel = [1003, 1005, 1006, 1007, 1008];
      let arr1 = this.pointLine.map((item) => {
        return {
          category: vLevel.indexOf(item.subType),
          name: item.subName,
          id: item.name,
          x: item.value[0],
          y: item.value[1],
          draggable: false,
        };
      });
      let arr2 = ldata.map((item) => {
        return {
          source: item.startId,
          target: item.endId,
          value: item.name,
          lineStyle: {
            color: "#eb3323",
            width: 6,
            curveness: 0.1,
          },
        };
      });
      //绘制500kv变电站和他们之间的连线
      this.drawChart(arr1, arr2);
    },
    // 获取上级变电站
    getHigherNode(higherNode, currentNode) {
      higherNode.aclineList.forEach((m) => {
        if (m.toName === currentNode.name) {
          this.higherName.push(
            higherNode.subName.split(".").reverse()[0],
            currentNode.subName.split(".").reverse()[0]
          );
          // this.higherName.push(this.feedLineName);
          this.inLineNode = Array.from(new Set(this.higherName));
        }
      });
    },
    //处理馈线数据
    handleFeedData(id) {
      http.getDisPoints(id).then((res) => {
        let feedLinks = res.daclineList.map((item) => {
          return {
            source: res.name,
            target: item.v_id,
            value: item.v_name,
            lineStyle: {
              color: "rgb(33, 75, 166)",
              width: 6,
              curveness: 0.1,
            },
          };
        });
        let feedNodes = res.daclineList.map((item) => {
          return {
            category: 5,
            id: item.v_id,
            name: item.v_name,
            x: 119.1,
            y: 39.1,
          };
        });
        feedNodes = this.contactNodeJson(feedNodes, this.feedNodes);
        feedLinks = this.contactLinkJson(feedLinks, this.feedLinks);
        this.feedNodes = feedNodes;
        this.feedLinks = feedLinks;
        return [feedNodes, feedLinks];
      });
    },
    // 按父节点站来获取下级变电站
    async toGetNextGvisMap(info) {
      // 获取500kv的变电站及下层220kv变电站
      if (info.data.category === 0) {
        this.pointLine = await http.getSubNodeById(info.data.id + "/1003");
        let clickPoint = [this.pointFormat(this.pointLine)]; //当前点击的500kv的点
        let arr = this.initChartOption(this.pointLine, true);
        arr[0].unshift(this.pointFormat(this.pointLine)); // 将当前点击的500kv的点添加到arr
        this.arr11 = arr;
        this.drawChart(...this.arr11);
        //获取220kv变电站所有下层节点（110kv变电站和馈线)
      } else if (info.data.category === 1) {
        this.handleFeedData(info.data.id); // 处理220kv下层的馈线
        http.getSubNodeById(info.data.id + "/1005").then((res) => {
          this.kv220Obj = res;
          this.getHigherNode(this.pointLine, res);
          let arr = this.initChartOption(res, true);
          let newArr = [
            arr[0].concat(this.feedNodes),
            arr[1].concat(this.feedLinks),
          ];
          this.dataArr = newArr;
          this.drawChart(...newArr);
        });
        // 获取110kv变电站所有下层节点(10kv变电站和馈线)
      } else if (info.data.category === 2) {
        this.handleFeedData(info.data.id); // 处理110kv下层的馈线
        http.getSubNodeById(info.data.id + "/1006").then((res) => {
          this.kv110Obj = res;
          this.getHigherNode(this.kv220Obj, res);
          let arr = this.initChartOption(res, true);
          let newArr = [
            arr[0].concat(this.feedNodes),
            arr[1].concat(this.feedLinks),
          ];
          this.dataArr = newArr;
          this.drawChart(...newArr);
        });
      } else if (info.data.category === 5) {
        if (this.kv220Obj && !this.kv110Obj) {
          //点击的是220kv下的馈线
          http.getDisPoints(this.kv220Obj.name).then((res) => {
            this.handleDksData(res, info);
          });
        } else if (this.kv110Obj) {
          //点击的是110kv下的馈线
          http.getDisPoints(this.kv110Obj.name).then((res) => {
            this.handleDksData(res, info);
            this.inLineNode.push(info.data.name);
           
          });
        }
      } else {
        http.getSubNodeById(info.data.id + "/1008").then((res) => {
          this.kv35Obj = res;
          this.getHigherNode(this.kv110Obj, res);
        });
      }
    },
    // 处理配电室数据
    handleDksData(res, info) {
      let vLevel = [1003, 1005, 1006, 1007, 1008, 1010, 1012];
      res.daclineList.forEach((m) => {
        if (m.v_id === info.data.id) {
          let dkspoint = m.dksList.map((item) => {
            return {
              category: vLevel.indexOf(item.subType),
              name: item.subName,
              id: item.name,
              x: item.value[0],
              y: item.value[1],
              draggable: false,
            };
          });
          let dksline = m.dksList.map((item) => {
            return {
              source: m.v_id,
              target: item.name,
              lineStyle: {
                color: "rgb(33, 75, 166)",
                width: 6,
                curveness: 0.1,
              },
            };
          });
          let newArr = [
            this.dataArr[0].concat(dkspoint),
            this.dataArr[1].concat(dksline),
          ];
          this.drawChart(...newArr);
        }
      });
    },
    // 绘图
    drawChart(nodes, links, changeOption) {
      let categories = [
        { name: "500kV" },
        { name: "220kV" },
        { name: "110kV" },
        { name: "35kV" },
        { name: "10kV" },
        { name: "馈线" },
        { name: "配变" },
      ];
      // 重新制图
      if (
        this.myChart != null &&
        this.myChart != "" &&
        this.myChart != undefined
      ) {
        this.myChart.dispose();
      }
      this.myChart = echarts.init(document.getElementById("chartMap1"));
      (() => {
        let option = (this.option = {
          title: {
            top: "bottom",
            left: "right",
          },
          tooltip: {
            backgroundColor: "rgba(58,63,63,1)",
            position: function (point, params, dom, rect, size) {
              return point;
            },
            formatter: function (params) {
              let item = params.data;
              if (item.value) {
                return item.value;
              } else if (item.category === 5) {
                return item.name;
              } else if (item.name) {
                let subName = item.name.split(".").reverse()[0];
                let html =
                  '<div style="display: flex;flex-direction: column;padding:10px;height:80px;width:250px"><div style="font-weight: bold;margin-bottom: 5px;">' +
                  "变电站：" +
                  subName +
                  "<div>电压等级：" +
                  categories[item.category].name +
                  "</div>" +
                  "<div>经度：" +
                  item.x +
                  "纬度：" +
                  item.y +
                  "</div>";
                ("</div>");
                return html;
              }
            },
          },
          legend: [
            {
              data: categories.map(function (a) {
                return a.name;
              }),
              textStyle: {
                color: "#000",
              },
              right: 40,
              bottom: 10,
              orient: "vertical",
            },
          ],
          color: [
            "rgb(255,0,0)",
            "rgb(255,0,255)",
            "rgb(200,42,24)",
            "rgb(255,255,0)",
            "rgb(170,170,0)",
            "rgb(33, 75, 166)",
            // "rgb(33, 75, 166)",
            "#0000FF",
          ],
          animation: false,
          series: [
            {
              name: "Les Miserables",
              type: "graph",
              layout: "force",
              zoom: 0.002,
              center: [115.97, 29.71],
              data: nodes,
              links: links,
              categories: categories,
              roam: true,
              draggable: false,
              label: {
                position: "inside",
                show: true,
                color: "#000",
                fontWeight: "bold",
                formatter: function (params) {
                  let item = params.data;
                  if (item.name) {
                    let subName = item.name.split(".").reverse()[0];
                    return subName;
                  }
                },
              },
              focusNodeAdjacency: true,
              itemStyle: {
                normal: {
                  borderColor: "orange",
                  borderWidth: 2,
                  shadowBlur: 10,
                  shadowColor: "rgba(0, 0, 0, 0.3)",
                },

                emphasis: {
                  borderWidth: 6,
                },
              },
              force: {
                repulsion: 500,
                edgeLength: [6, 60],
              },
              symbolSize: function (value, params) {
                let size = 180;
                if (params.data && params.data.category) {
                  let number = params.data.category;
                  switch (number) {
                    case 0:
                      size = 180;
                      break;
                    case 1:
                      size = 160;
                      break;
                    case 2:
                      size = 140;
                      break;
                    case 3:
                      size = 120;
                      break;
                    case 4:
                      size = 100;
                      break;
                    case 5:
                      size = 80;
                    case 6:
                      size = 60;
                    default:
                      break;
                  }
                }
                return size;
              },
              markPoint: {
                symbol: "arrow",
              },
            },
          ],
        });
        if (changeOption) {
          option.series[0].zoom = changeOption.zoom;
          option.series[0].force = changeOption.force;
          option.series[0].symbolSize = changeOption.symbolSize;
        }

        this.myChart.setOption(option, true);
      })();
      let map = document.getElementById("chartMap1");
      map.oncontextmenu = function () {
        return false;
      };
      // 右键菜单
      this.myChart.on("contextmenu", (params) => {
        this.rightClikeItem = params;
        this.rightMenu = this.rightMenu1;
        this.showMenu(params.event.event);
      });
    },
    // 菜单定位
    showMenu(e) {
      this.isShowMenu = true;
      this.menuPosition.menuTop = e.offsetY - 80 + "px";
      this.menuPosition.menuLeft = e.offsetX + "px";
    },
    // 展示下层节点
    showLowerNode() {
      this.toGetNextGvisMap(this.rightClikeItem);
      this.isShowMenu = false;
    },
    // 显示供电路径
    showPowerLine() {
      http.getSubEquById("1").then((res) => {
        this.equipInfo = (res.results || []).map((m) => ({
          ...m,
          isCollapse: true,
        }));
      });
      this.showRightDialog = true;
      this.isShowMenu = false;
      // 获取当前路径上的线
      // let array1 = this.kv220Obj.aclineList;
      // let array2 = this.kv110Obj.aclineList;
      // array1.forEach((m) => {
      //   if (m.toName === this.kv110Obj.name) {
      //     let wayLinks = this.option.series[0].links;
      //     wayLinks.forEach((n) => {
      //       if (n.source === m.toName) {
      //         // n.lineStyle = {
      //         //   color: "#FF1493",
      //         //   width: 15,
      //         //   curveness: 0.1,
      //         // };
      //         console.log(n);
      //       }
      //     });
      //   }
      // });
    },
    changeIcon(item) {
      item.isCollapse
        ? this.$set(item, "isCollapse", false)
        : this.$set(item, "isCollapse", true);
    },
    closeLeftDialog() {
      this.showLeftDialog = false;
      this.showRightDialog = false;
    },
    changeicon() {
      if (this.rightIsCollapse) {
        this.rightIsCollapse = false;
      } else {
        this.rightIsCollapse = true;
      }
    },
    showEquipList() {
      this.showLeftDialog = true;
    },
    spreadAll() {
      this.activeName = [];
      for (const collapseTitleData of this.equipInfo) {
        console.log(collapseTitleData);
        if (collapseTitleData.isCollapse) {
          this.activeName.push(!collapseTitleData.isCollapse);
        }
        console.log(this.activeName);
      }
    },
    //展示接线图
    showDiagram() {
      alert("1");
    },
    // 还原力学图
    reset() {
      this.nodes = [];
      this.links = [];
      this.feedLinks = [];
      this.feedNodes = [];
      this.inLineNode = [];
      this.getGviMap();
      this.showRightDialog = false;
    },
  },
};
</script>
<style lang='scss' scoped>
.container {
  font-family: "Microsoft YaHei", 微软雅黑, "MicrosoftJhengHei", 华文细黑,
    STHeiti, MingLiu;
  width: 100%;
  height: 100%;
  .reset {
    margin-top: 30px;
    margin-left: 30px;
    button {
      display: inline-block;
      width: 70px;
      height: 35px;
    }
  }
  .rightMenu {
    position: absolute;
    width: 244px;
    background-color: #2d2d2d;
    border-radius: 6px;
    border: solid 2px #4ecbc4;
    opacity: 0.6;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    color: #ffffff;
    .rightItem {
      height: 65px;
      line-height: 65px;
      cursor: pointer;
      div {
        margin: 0 auto;
        width: 203px;
        text-align: center;
        border-bottom: solid 2px #222222;
        cursor: pointer;
      }
    }
    .rightItem:last-child div {
      border-bottom: none;
    }
    .rightItem:hover {
      background: #860a0a;
    }
  }
  .equipmentList,
  .powerLine {
    width: 390px;
    height: 630px;
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
  }
  /deep/ :focus {
    outline: 0;
  }
  .leftWrapper {
    position: absolute;
    left: 20px;
    top: 94px;
    width: 400px;
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
      cursor: pointer;
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
}
.rightWrapper {
  position: absolute;
  right: 20px;
  top: 94px;
  width: 400px;
  height: 83%;
  background: #ffffff;
  box-shadow: 0 0 6px 0 rgba(19, 75, 163, 0.3);
  border-radius: 8px;
  padding: 5px 5px 5px 5px;
  display: flex;
  flex-direction: column;
  .right-tab {
    width: 100%;
    height: 42px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    font-size: 14px;
    .right-tab-selected-item {
      opacity: 0.5;
      background: #d2d5d8;
      text-align: center;
      width: 198px;
      color: 000;
      line-height: 42px;
      border-radius: 8px 8px 0 0;
    }
    .right-tab-unselected-item {
      text-align: center;
      background-color: #006569;
      width: 198px;
      line-height: 42px;
      border-radius: 8px 8px 0 0;
      color: #fff;
    }
  }
  .right-tool-box {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    font-size: 14px;
    color: #3a3a3a;
    letter-spacing: 0;
    margin-top: 15px;
    .right-tool-item {
      height: 33px;
      width: 93px;
      border: 1px solid #124472;
      border-radius: 6px;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
    }
  }
  .right-content-title-box {
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

  .right-content-title {
    margin-top: 30px;
  }
}
.chartMap {
  width: 100%;
  height: 100%;
}
</style>