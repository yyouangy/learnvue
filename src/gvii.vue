<template>
  <div class="container">
    <!-- <div class="reset">
      <button @click="reset">还原</button>
    </div>-->
    <div id="chartMap1" class="chartMap"></div>
  </div>
</template>
<script>
import * as http from "./../../service/geographyMap/geographyMap.js";
import axios from "../../config/http";
// import myOption from "../data/my-gvi-config.js";
import tdata from "../data/data-point.json";
import ldata from "../data/data-line.json";
import { log } from "util";
var echarts = require("echarts");
echarts.dataTool = require("echarts/extension/dataTool/index");
export default {
  data() {
    return {
      categories: [
        { name: "500kV" },
        { name: "220kV" },
        { name: "110kV" },
        { name: "35kV" },
        { name: "10kV" },
        { name: "馈线" },
      ],
      color: [
        "rgb(255,0,0)",
        "rgb(255,0,255)",
        "rgb(240,65,85)",
        "rgb(255,255,0)",
        "rgb(170,170,0)",
        "rgb(33, 75, 166)",
      ],
      points: [],
      // links: [],
      nodes: [],
      // links:[],
      myChart: null,
      option:{}
    };
  },
  mounted() {
    // this.pointFormatter();
    // this.lineFormatter();
    this.$nextTick(() => {
      this.getSubNode();
      // this.toGetNextGvisMap()
    });
  },
  created() {},
  methods: {
    pointFormat(data) {
      let vLevel = [1003, 1005, 1006, 1007, 1008];
      return {
        category: vLevel.indexOf(data.subType),
        name: data.subName,
        id: data.name,
        x: data.value[0],
        y: data.value[1],
        draggable: true,
      };
    },
    //初始化力学图数据
    initChartOption(data) {
      var vLevel = [1003, 1005, 1006, 1007, 1008];
      // console.log(data);
      this.points = data.map((item) => {
        // console.log(item);
        return {
          category: vLevel.indexOf(item.subType),
          name: item.subName,
          id: item.name,
          x: item.value[0],
          y: item.value[1],
          // draggable: true,
        };
      });
      // this.links = data
      //   .filter((item) => Object.keys(item) == "line")[0]
      //   .line.map((item) => {
      //     return {
      //       lineId: item.attributes.ID,
      //       source: item.attributes.END_ST_ID || item.attributes.END_St_ID,
      //       target: item.attributes.START_ST_ID || item.attributes.StARt_St_ID,
      //       name: item.attributes.NAME,
      //       //weight : 1,
      //       lineStyle: {
      //         width: 3,
      //       },
      // };
      // });
    },

    // contactJson(newJson, oldJson) {
    //   newJson = newJson.filter((itemNew) => {
    //     return !oldJson.some((itemOld) => itemNew.name === itemOld.name);
    //   });
    //   return [...newJson, ...oldJson];
    // },
    //获取500kv变电站，初始化力学图
    async getSubNode() {
      this.nodes = await http.getSubsOf500KV(500);
      // console.log(this.nodes);
      // this.links = ldata;
      var vLevel = [1003, 1005, 1006, 1007, 1008];

      // let arr = this.initChartOption(this.nodes, true)
      // console.log(arr)
      let arr1 = this.nodes.map((item) => {
        return {
          category: vLevel.indexOf(item.subType),
          name: item.subName,
          id: item.name,
          x: item.value[0],
          y: item.value[1],
          // draggable: true,
        };
      });
      // console.log(arr1);

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
      // console.log(arr2);
      var initSeries = {
        zoom: 0.001,
        force: {
          repulsion: 500, // 斥力
          edgeLength: [120, 200], // 连线长度
        },
        symbolSize: 100, // 节点大小
      };
      this.drawChart(arr1, arr2, initSeries);
      //监听点击
      this.myChart.on("click", (params) => {
        //点击500kv变电站获取500kv的下层节点
        http.getSubNodeById(params.data.id + "/1003").then((res) => {
          // console.log(res);
          // let arr3=[];
          // arr3=this.initChartOption(res.childSubList)
          // console.log(arr3);
          let arr31 = [this.pointFormat(res)];
          let arr32 = res.childSubList.map((item) => {
            return {
              category: vLevel.indexOf(item.subType),
              name: item.subName,
              id: item.name,
              x: item.value[0],
              y: item.value[1],
              // draggable: true,
            };
          });
          let arr3 = arr31.concat(arr32);
          // console.log(arr3);
          let arr4 = res.aclineList.map((item) => {
            // console.log(item);
            return {
              source: item.fromName,
              target: item.toName,
              // value: item.name,
              lineStyle: {
                color: "#eb3323",
                width: 6,
                curveness: 0.1,
              },
            };
          });
          // console.log(arr4);
          this.drawChart(arr3, arr4, initSeries);
          this.myChart.on("click", (params) => {
            //点击220kv变电站获取110kv的下层节点
            console.log(params);
            http.getSubNodeById(params.data.id + "/1005").then((res) => {
              console.log(res);
              // let arr31 = [this.pointFormat(res)];
          let arr5 = res.childSubList.map((item) => {
            return {
              category: vLevel.indexOf(item.subType),
              name: item.subName,
              id: item.name,
              x: item.value[0],
              y: item.value[1],
              // draggable: true,
            };
          });
          // let arr3 = arr31.concat(arr32);
          // console.log(arr3);
          let arr6 = res.aclineList.map((item) => {
            // console.log(item);
            return {
              source: item.fromName,
              target: item.toName,
              // value: item.name,
              lineStyle: {
                color: "#eb3323",
                width: 6,
                curveness: 0.1,
              },
            };
          });
          console.log(this.option);
          // console.log(arr4);
          this.drawChart(arr3.concat(arr5), arr4.concat(arr6), initSeries);
      this.myChart = echarts.init(document.getElementById("chartMap1"));

          this.option.series.data=arr3.concat(arr5);
        this.myChart.setOption(this.option, true);

            });
          });
        });
      });
    },

    // 绘图
    drawChart(nodes, links, changeOption) {
      var categories = [
        { name: "500kV" },
        { name: "220kV" },
        { name: "110kV" },
        { name: "35kV" },
        { name: "10kV" },
        { name: "馈线" },
      ];
      // 重新制图
      // if (
      //   this.myChart != null &&
      //   this.myChart != "" &&
      //   this.myChart != undefined
      // ) {
      //   this.myChart.dispose();
      // }

      this.myChart = echarts.init(document.getElementById("chartMap1"));
      // myChart.showLoading();
      // this.$.get(
      //   "./les-miserables.gexf",
      (() => {
        // this.myChart.hideLoading();
        var option =this.option= {
          title: {
            //text: "Les Miserables",
            //subtext: "Default layout",
            top: "bottom",
            left: "right",
          },
          tooltip: {
            backgroundColor: "rgba(58,63,63,1)",
            position: function (point, params, dom, rect, size) {
              return point;
            },
            formatter: function (params) {
              // console.log(params);
              var item = params.data;
              var subName = item.name.split(".").reverse()[0];
              var html =
                '<div style="display: flex;flex-direction: column;padding:10px;height:80px;width:250px"><div style="font-weight: bold;margin-bottom: 5px;">' +
                "变电站：" +
                subName +
                "<div>电压等级：" +
                item +
                "</div>" +
                "<div>经度：" +
                item.x +
                "纬度：" +
                item.y +
                "</div>";
              ("</div>");
              return html;
            },
          },
          legend: [
            {
              // selectedMode: 'single',
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
            "rgb(240,65,85)",
            "rgb(255,255,0)",
            "rgb(170,170,0)",
            "rgb(33, 75, 166)",
          ],
          animation: false,
          series: [
            {
              name: "Les Miserables",
              type: "graph",
              layout: "force",
              zoom: 0.00001,
              data: nodes,
              links: links,
              categories: categories,
              roam: true,
              label: {
                position: "center",
                offset: [10, 15],
                show: true,
                color: "#fff",
                fontWeight: "bold",
                formatter: function (params) {
                  // console.log(params);
                  var item = params.data;
                  var subName = item.name.split(".").reverse()[0];
                  return subName;
                },
              },
              itemStyle: {
                // borderColor: '#000',
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
                repulsion: 1, // 斥力
                edgeLength: 0.01, // 连线长度
              },
              symbolSize: 50, // 节点大小
            },
          ],
        };
        if (changeOption) {
          option.series[0].zoom = changeOption.zoom;
          option.series[0].force = changeOption.force;
          option.series[0].symbolSize = changeOption.symbolSize;
          // option.series[0].data=
        }

        this.myChart.setOption(option, true);
      })();
    },
  },
};
//     lineFormatter() {
//       this.links = ldata.map((item) => {
//         return {
//           source: item.startId,
//           target: item.endId,
//           value: item.name,
//           lineStyle: {
//             color: "#eb3323",
//             width: 6,
//             curveness: 0.1,
//           },
//         };
//       });
//     },
//     async initChart() {
//       if (
//         this.myChart != null &&
//         this.myChart != "" &&
//         this.myChart != undefined
//       ) {
//         this.myChart.dispose();
//       }
//       this.myChart = echarts.init(document.getElementById("chartMap1"));
//       myOption.color = this.color;
//       //绘制500kv变电站和它们的连线
//       myOption.series[0].data = this.points;
//       myOption.series[0].links = this.links;
//       myOption.series[0].categories = this.categories;
//       myOption.legend[0].data = this.categories.map(function (a) {
//         return a.name;
//       });
//       //监听点击事件
//       this.myChart.on("click", (params) => {
//         //点击500kv变电站获取500kv的下层节点
//         http.getSubNodeById(params.data.id + "/1003").then((res) => {
//           console.log(res);
//           let vLevel = [1003, 1005, 1006, 1007, 1008];
//           let arr1 = [this.pointFormat(res)];
//           let arr2 = res.childSubList.map((item) => {
//             console.log(item.sub);
//             return {
//               category: vLevel.indexOf(item.subType),
//               name: item.subName,
//               id: item.name,
//               x: item.value[0],
//               y: item.value[1],
//               draggable: true,
//             };
//           });
//           //arr去重
//           let newobj = {};
//           arr2 = arr2.reduce((preVal, curVal) => {
//             newobj[curVal.id] ? "" : (newobj[curVal.id] = preVal.push(curVal));
//             return preVal;
//           }, []);
//           let arr3 = [];
//           arr3 = arr1.concat(arr2);

//           // 500kv和下层节点的连线
//           let arr4 = res.aclineList.map((item) => {
//             return {
//               source: item.fromName,
//               target: item.toName,
//               lineStyle: {
//                 color: "#eb3323",
//                 width: 6,
//                 curveness: 0.1,
//               },
//             };
//           });
//            myOption.color = this.color;
//           myOption.series[0].data = arr3;
//           myOption.series[0].links = arr4;
//           this.myChart = echarts.init(document.getElementById("chartMap1"));
//           this.myChart.setOption(myOption, true);
//         });
//         //点击220kv变电站获取220kv的下层节点
//          http.getSubNodeById(params.data.id + "/1005").then((res) => {
//            console.log(res);
//            let vLevel = [1003, 1005, 1006, 1007, 1008];
//           let arr1 = [this.pointFormat(res)];
//           let arr2 = res.childSubList.map((item) => {
//             return {
//               category: vLevel.indexOf(item.subType),
//               name: item.subName,
//               id: item.name,
//               x: item.value[0],
//               y: item.value[1],
//               draggable: true,
//             };
//           });
//           //arr去重
//           let newobj = {};
//           arr2 = arr2.reduce((preVal, curVal) => {
//             newobj[curVal.id] ? "" : (newobj[curVal.id] = preVal.push(curVal));
//             return preVal;
//           }, []);
//           let arr3 = [];
//           arr3 = arr1.concat(arr2);

//           // 500kv和下层节点的连线
//           let arr4 = res.aclineList.map((item) => {
//             return {
//               source: item.fromName,
//               target: item.toName,
//               lineStyle: {
//                 color: "#eb3323",
//                 width: 6,
//                 curveness: 0.1,
//               },
//             };
//           });
//            myOption.color = this.color;
//           myOption.series[0].data = arr3;
//           myOption.series[0].links = arr4;
//           this.myChart = echarts.init(document.getElementById("chartMap1"));
//           this.myChart.setOption(myOption, true);
//          })
//       });
//       this.myChart.setOption(myOption, true);
</script>
<style lang='scss' scoped>
.container {
  font-family: "Microsoft YaHei", 微软雅黑, "MicrosoftJhengHei", 华文细黑,
    STHeiti, MingLiu;
  width: 100%;
  height: 100%;
  // .reset {
  //   margin-top: 30px;
  //   margin-left: 30px;
  //   button {
  //     display: inline-block;
  //     width: 70px;
  //     height: 35px;
  //   }
  // }
}

.chartMap {
  width: 100%;
  height: 100%;
}
</style>