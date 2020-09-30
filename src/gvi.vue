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
      // categories: [
      //   { name: "500kV" },
      //   { name: "220kV" },
      //   { name: "110kV" },
      //   { name: "35kV" },
      //   { name: "10kV" },
      //   { name: "馈线" },
      // ],
      // color: [
      //   "rgb(255,0,0)",
      //   "rgb(255,0,255)",
      //   "rgb(240,65,85)",
      //   "rgb(255,255,0)",
      //   "rgb(170,170,0)",
      //   "rgb(33, 75, 166)",
      // ],
      // points: [],
      // links: [],
      // nodes: [],
      //  links:[],
      // myChart: null,
      // option: {},
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.getGviMap();
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
    initChartOption(data, isAdd) {
      var vLevel = [1003, 1005, 1006, 1007, 1008];
      var nodes = this.nodes = data.childSubList.map((item) => {
        return {
          category: vLevel.indexOf(item.subType),
          name: item.subName,
          id: item.name,
          x: item.value[0],
          y: item.value[1],
          // draggable: true,
        };
      });

      var links = this.links = data.aclineList.map((item) => {
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
        nodes = this.contactJson(nodes, this.nodes);
        links = this.contactJson(links, this.links);
      }
      this.nodes = nodes;
      this.links = links;
      return [nodes, links];
    },
    // 对象去重合并
    contactJson(newJson, oldJson) {
      newJson = newJson.filter((itemNew) => {
        return !oldJson.some((itemOld) => itemNew.name === itemOld.name);
      });
      // console.log(newJson);
      // console.log(oldJson);
      // console.log(newJson.concat(oldJson));
      // return newJson.concat(oldJson)
      // console.log([...newJson,...oldJson]);
      return [...newJson, ...oldJson];
    },

    // 获取500kv变电站，初始化力学图
    async getGviMap() {
      var vLevel = [1003, 1005, 1006, 1007, 1008];
      this.nodes = await http.getSubsOf500KV(500);
      let arr1 = this.nodes.map((item) => {
        return {
          category: vLevel.indexOf(item.subType),
          name: item.subName,
          id: item.name,
          x: item.value[0],
          y: item.value[1],
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
      var initSeries = {
        zoom: 0.002,
        force: {
          repulsion: 500, // 斥力
          edgeLength: [120, 200], // 连线长度
        },
        symbolSize: 100, // 节点大小
      };
      this.drawChart(arr1, arr2, initSeries);
      this.toGetNextGvisMap();
    },
    // 按父节点站来获取下级电站
    toGetNextGvisMap() {
      this.myChart.on("click", (params) => {
        // console.log(params);
        http.getSubNodeById(params.data.id + "/1003").then((res) => {
          let clickPoint = [this.pointFormat(res)]; //点击的500kv的点
          let arr2 = this.initChartOption(res);
          let arr1 = clickPoint.concat(arr2[0]);
          var initSeries1 = {
            zoom: 0.001,
            force: {
              repulsion: 500, // 斥力
              edgeLength: [120, 200], // 连线长度
            },
            symbolSize: 100, // 节点大小
          };
          this.drawChart(arr1, arr2[1], initSeries1);
          this.myChart.on("click", (params) => {
          // console.log(params);
          http.getSubNodeById(params.data.id + "/1005").then((res) => {
            console.log(res);
            let clickPoint = [this.pointFormat(res)]; //点击的220kv的点
            let arr4 = this.initChartOption(res, true);
            let arr3 = clickPoint.concat(arr4[0]);
            var initSeries1 = {
              zoom: 0.001,
              force: {
                repulsion: 500, // 斥力
                edgeLength: [120, 200], // 连线长度
              },
              symbolSize: 100, // 节点大小
            };
            // console.log(...arr);
            console.log(arr1.concat(arr3));
            console.log(arr2[1].concat(arr4[1]));
            this.drawChart(arr1.concat(arr3),arr2[1].concat(arr4[1]),initSeries1);
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
        var option = (this.option = {
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
              if (item.value) {
                return item.value;
              } else {
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
              }
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
              zoom: 0.1,
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
              symbolSize: 100, // 节点大小
            },
          ],
        });
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
 // http.getDisPoints(info.data.id).then((res) => {
    //   // console.log(res);
    //   线 this.ndharr = res.daclineList.map((item) => {
    //     return {
    //       source: res.name,
    //       target: item.v_id,
    //       value: item.v_name,
    //       lineStyle: {
    //         color: "rgb(33, 75, 166)",
    //         width: 6,
    //         curveness: 0.1,
    //       },
    //     };
    //   });
    //   this.falseNode = [
    //     {
    //       category: 5,
    //       id: "113715892319158929",
    //       name: "10kV南戴河变电站513南官线",
    //       x: 119.1,
    //       y: 39.1,
    //     },
    //     {
    //       category: 5,
    //       id: "113715892319158974",
    //       name: "10kV南戴河变电站516华贸一线",
    //       x: 119.2,
    //       y: 39.2,
    //     },
    //     {
    //       category: 5,
    //       id: "113715892319158963",
    //       name: "10kV南戴河变电站514戴三线",
    //       x: 119.3,
    //       y: 39.3,
    //     },
    //     {
    //       category: 5,
    //       id: "113715892319158951",
    //       name: "10kV南戴河变电站512沿海线",
    //       x: 119.4,
    //       y: 39.4,
    //     },
    //     {
    //       category: 5,
    //       id: "113715892319158975",
    //       name: "10kV南戴河变电站524华贸二线",
    //       x: 119.5,
    //       y: 39.5,
    //     },
    //   ];
    //   // console.log(this.ndharr);
    //   // console.log(this.falseNode);
    //   var newArr = [];
    //   newArr[0] = arr[0].concat(this.falseNode);
    //   newArr[1] = arr[1].concat(this.ndharr);
    //   // console.log(newArr);

    //   this.drawChart(...newArr);
    //   this.myChart.on("click", (params) => {
    //     if (params.data.category === 5) {
    //       let arr = res.daclineList[4].dksList;
    //       console.log(arr);
    //       let dks = arr.map((item) => {
    //         return {
    //           category: 5,
    //           name: item.subName,
    //           id: item.name,
    //           x: item.value[0],
    //           y: item.value[1],
    //           draggable: false,
    //         };
    //       });
    //       let line = res.daclineList[4].dksList.map((item) => {
    //         return {
    //           source: res.daclineList[4].v_id,
    //           target: item.name,
    //           lineStyle: {
    //             color: "rgb(33, 75, 166)",
    //             width: 6,
    //             curveness: 0.1,
    //           },
    //         };
    //       });
    //       // console.log(newArr);
    //       let newArr1 = [];
    //       newArr1[0] = newArr[0].concat(dks);
    //       newArr1[1] = newArr[1].concat(line);
    //       this.drawChart(...newArr1);
    //       console.log(line);
    //     }
    //   });
    // });
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

