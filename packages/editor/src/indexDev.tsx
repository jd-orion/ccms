
import React from 'react'
import ReactDOM from 'react-dom'
import { FormConfig } from 'ccms/dist/src/steps/form'
import App, { AppProps } from './app'
import DefaultConfig from './DefaultConfig'
import appInfo from '../package.json'
import 'antd/dist/antd.css'
const treeData = [
  {
    "value": 621,
    "title": "管理",
    "menuPath": "manage",
    "menuType": 1,
    "menuVersion": null,
    "isHidden": false,
    "menuPathFull": "manage",
    "menuOrder": 0,
    "menuIcon": "",
    "menuDesc": "",
    "canMoveUp": false,
    "canMoveDown": true,
    "children": [
      {
        "value": 622,
        "title": "业务管理",
        "menuPath": "config",
        "menuType": 0,
        "menuVersion": null,
        "isHidden": false,
        "menuPathFull": "manage/config",
        "menuOrder": 0,
        "menuIcon": "",
        "menuDesc": "",
        "canMoveUp": false,
        "canMoveDown": true,
        "children": []
      },
      {
        "value": 623,
        "title": "角色管理",
        "menuPath": "roleConfig",
        "menuType": 0,
        "menuVersion": null,
        "isHidden": false,
        "menuPathFull": "manage/roleConfig",
        "menuOrder": 1,
        "menuIcon": "",
        "menuDesc": "",
        "canMoveUp": true,
        "canMoveDown": true,
        "children": []
      },
      {
        "value": 624,
        "title": "成员管理",
        "menuPath": "memberConfig",
        "menuType": 0,
        "menuVersion": null,
        "isHidden": false,
        "menuPathFull": "manage/memberConfig",
        "menuOrder": 2,
        "menuIcon": "",
        "menuDesc": "",
        "canMoveUp": true,
        "canMoveDown": false,
        "children": []
      }
    ]
  },
  {
    "value": 625,
    "title": "业务楼层",
    "menuPath": "business",
    "menuType": 1,
    "menuVersion": null,
    "isHidden": false,
    "menuPathFull": "business",
    "menuOrder": 1,
    "menuIcon": "",
    "menuDesc": "",
    "canMoveUp": true,
    "canMoveDown": true,
    "children": [
      {
        "value": 626,
        "title": "运营配置",
        "menuPath": "operate",
        "menuType": 1,
        "menuVersion": null,
        "isHidden": false,
        "menuPathFull": "business/operate",
        "menuOrder": 0,
        "menuIcon": "",
        "menuDesc": "",
        "canMoveUp": false,
        "canMoveDown": false,
        "children": [
          {
            "value": 627,
            "title": "楼层配置",
            "menuPath": "floor_config",
            "menuType": 5,
            "menuVersion": "1.2.0",
            "isHidden": false,
            "menuPathFull": "business/operate/floor_config",
            "menuOrder": 0,
            "menuIcon": "",
            "menuDesc": "",
            "canMoveUp": false,
            "canMoveDown": true,
            "children": [
              {
                "value": 628,
                "title": "创建楼层",
                "menuPath": "create",
                "menuType": 5,
                "menuVersion": "1.2.0",
                "isHidden": false,
                "menuPathFull": "business/operate/floor_config/create",
                "menuOrder": 0,
                "menuIcon": "",
                "menuDesc": "",
                "canMoveUp": false,
                "canMoveDown": true,
                "children": []
              },
              {
                "value": 629,
                "title": "修改通用配置",
                "menuPath": "update_all",
                "menuType": 5,
                "menuVersion": "1.2.0",
                "isHidden": false,
                "menuPathFull": "business/operate/floor_config/update_all",
                "menuOrder": 1,
                "menuIcon": "",
                "menuDesc": "",
                "canMoveUp": true,
                "canMoveDown": true,
                "children": []
              },
              {
                "value": 630,
                "title": "修改苹果配置",
                "menuPath": "update_apple",
                "menuType": 5,
                "menuVersion": "1.2.0",
                "isHidden": false,
                "menuPathFull": "business/operate/floor_config/update_apple",
                "menuOrder": 2,
                "menuIcon": "",
                "menuDesc": "",
                "canMoveUp": true,
                "canMoveDown": true,
                "children": []
              },
              {
                "value": 631,
                "title": "修改安卓配置",
                "menuPath": "update_android",
                "menuType": 5,
                "menuVersion": "1.2.0",
                "isHidden": false,
                "menuPathFull": "business/operate/floor_config/update_android",
                "menuOrder": 3,
                "menuIcon": "",
                "menuDesc": "",
                "canMoveUp": true,
                "canMoveDown": false,
                "children": []
              }
            ]
          },
          {
            "value": 632,
            "title": "ICON管理",
            "menuPath": "icon_config",
            "menuType": 5,
            "menuVersion": "1.2.4",
            "isHidden": false,
            "menuPathFull": "business/operate/icon_config",
            "menuOrder": 1,
            "menuIcon": "",
            "menuDesc": "",
            "canMoveUp": true,
            "canMoveDown": false,
            "children": [
              {
                "value": 633,
                "title": "新增",
                "menuPath": "create",
                "menuType": 5,
                "menuVersion": "1.2.4",
                "isHidden": false,
                "menuPathFull": "business/operate/icon_config/create",
                "menuOrder": 0,
                "menuIcon": "",
                "menuDesc": "",
                "canMoveUp": false,
                "canMoveDown": true,
                "children": []
              },
              {
                "value": 634,
                "title": "删除",
                "menuPath": "remove",
                "menuType": 5,
                "menuVersion": "1.2.4",
                "isHidden": false,
                "menuPathFull": "business/operate/icon_config/remove",
                "menuOrder": 1,
                "menuIcon": "",
                "menuDesc": "",
                "canMoveUp": true,
                "canMoveDown": true,
                "children": []
              },
              {
                "value": 635,
                "title": "修改通用配置",
                "menuPath": "update_all",
                "menuType": 5,
                "menuVersion": "1.2.4",
                "isHidden": false,
                "menuPathFull": "business/operate/icon_config/update_all",
                "menuOrder": 2,
                "menuIcon": "",
                "menuDesc": "",
                "canMoveUp": true,
                "canMoveDown": true,
                "children": []
              },
              {
                "value": 636,
                "title": "修改苹果配置",
                "menuPath": "update_apple",
                "menuType": 5,
                "menuVersion": "1.2.4",
                "isHidden": false,
                "menuPathFull": "business/operate/icon_config/update_apple",
                "menuOrder": 3,
                "menuIcon": "",
                "menuDesc": "",
                "canMoveUp": true,
                "canMoveDown": true,
                "children": []
              },
              {
                "value": 637,
                "title": "修改安卓配置",
                "menuPath": "update_android",
                "menuType": 5,
                "menuVersion": "1.2.4",
                "isHidden": false,
                "menuPathFull": "business/operate/icon_config/update_android",
                "menuOrder": 4,
                "menuIcon": "",
                "menuDesc": "",
                "canMoveUp": true,
                "canMoveDown": true,
                "children": []
              },
              {
                "value": 2067,
                "title": "查看通用配置",
                "menuPath": "detail_all",
                "menuType": 5,
                "menuVersion": "1.2.4",
                "isHidden": false,
                "menuPathFull": "business/operate/icon_config/detail_all",
                "menuOrder": 5,
                "menuIcon": "",
                "menuDesc": "",
                "canMoveUp": true,
                "canMoveDown": true,
                "children": []
              },
              {
                "value": 2069,
                "title": "查看苹果配置",
                "menuPath": "detail_apple",
                "menuType": 5,
                "menuVersion": "1.2.4",
                "isHidden": false,
                "menuPathFull": "business/operate/icon_config/detail_apple",
                "menuOrder": 6,
                "menuIcon": "",
                "menuDesc": "",
                "canMoveUp": true,
                "canMoveDown": true,
                "children": []
              },
              {
                "value": 2070,
                "title": "查看安卓配置",
                "menuPath": "detail_android",
                "menuType": 5,
                "menuVersion": "1.2.4",
                "isHidden": false,
                "menuPathFull": "business/operate/icon_config/detail_android",
                "menuOrder": 7,
                "menuIcon": "",
                "menuDesc": "",
                "canMoveUp": true,
                "canMoveDown": true,
                "children": []
              },
              {
                "value": 2147,
                "title": "提交ICON",
                "menuPath": "icon_submit",
                "menuType": 5,
                "menuVersion": "1.2.4",
                "isHidden": false,
                "menuPathFull": "business/operate/icon_config/icon_submit",
                "menuOrder": 8,
                "menuIcon": "",
                "menuDesc": "",
                "canMoveUp": true,
                "canMoveDown": true,
                "children": []
              },
              {
                "value": 2148,
                "title": "上线ICON",
                "menuPath": "icon_online",
                "menuType": 5,
                "menuVersion": "1.2.4",
                "isHidden": false,
                "menuPathFull": "business/operate/icon_config/icon_online",
                "menuOrder": 9,
                "menuIcon": "",
                "menuDesc": "",
                "canMoveUp": true,
                "canMoveDown": true,
                "children": []
              },
              {
                "value": 2149,
                "title": "下线ICON",
                "menuPath": "offline_icon",
                "menuType": 5,
                "menuVersion": "1.2.4",
                "isHidden": false,
                "menuPathFull": "business/operate/icon_config/offline_icon",
                "menuOrder": 10,
                "menuIcon": "",
                "menuDesc": "",
                "canMoveUp": true,
                "canMoveDown": false,
                "children": []
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "value": 654,
    "title": "新建",
    "menuPath": "m_create",
    "menuType": 5,
    "menuVersion": "1.2.1",
    "isHidden": false,
    "menuPathFull": "m_create",
    "menuOrder": 2,
    "menuIcon": "",
    "menuDesc": "",
    "canMoveUp": true,
    "canMoveDown": true,
    "children": []
  },
  {
    "value": 656,
    "title": "交易配置",
    "menuPath": "tradeconfig",
    "menuType": 1,
    "menuVersion": null,
    "isHidden": false,
    "menuPathFull": "tradeconfig",
    "menuOrder": 3,
    "menuIcon": "",
    "menuDesc": "",
    "canMoveUp": true,
    "canMoveDown": true,
    "children": [
      {
        "value": 657,
        "title": "楼层管理",
        "menuPath": "floors",
        "menuType": 5,
        "menuVersion": "1.2.1",
        "isHidden": false,
        "menuPathFull": "tradeconfig/floors",
        "menuOrder": 0,
        "menuIcon": "",
        "menuDesc": "",
        "canMoveUp": false,
        "canMoveDown": true,
        "children": [
          {
            "value": 658,
            "title": "创建楼层",
            "menuPath": "create",
            "menuType": 5,
            "menuVersion": "1.2.1",
            "isHidden": false,
            "menuPathFull": "tradeconfig/floors/create",
            "menuOrder": 0,
            "menuIcon": "",
            "menuDesc": "",
            "canMoveUp": false,
            "canMoveDown": true,
            "children": []
          },
          {
            "value": 793,
            "title": "编辑楼层",
            "menuPath": "editFloor",
            "menuType": 5,
            "menuVersion": "1.2.2",
            "isHidden": false,
            "menuPathFull": "tradeconfig/floors/editFloor",
            "menuOrder": 2,
            "menuIcon": "",
            "menuDesc": "",
            "canMoveUp": true,
            "canMoveDown": true,
            "children": []
          },
          {
            "value": 818,
            "title": "正式楼层列表",
            "menuPath": "releaseFloorList",
            "menuType": 5,
            "menuVersion": "1.2.1",
            "isHidden": false,
            "menuPathFull": "tradeconfig/floors/releaseFloorList",
            "menuOrder": 7,
            "menuIcon": "",
            "menuDesc": "",
            "canMoveUp": true,
            "canMoveDown": true,
            "children": []
          },
          {
            "value": 785,
            "title": "删除楼层",
            "menuPath": "removeFloor",
            "menuType": 5,
            "menuVersion": "1.2.1",
            "isHidden": false,
            "menuPathFull": "tradeconfig/floors/removeFloor",
            "menuOrder": 8,
            "menuIcon": "",
            "menuDesc": "",
            "canMoveUp": true,
            "canMoveDown": true,
            "children": []
          },
          {
            "value": 738,
            "title": "上线审核(创建楼层保存并发布)",
            "menuPath": "reviewCreate",
            "menuType": 5,
            "menuVersion": "1.2.1",
            "isHidden": false,
            "menuPathFull": "tradeconfig/floors/reviewCreate",
            "menuOrder": 9,
            "menuIcon": "",
            "menuDesc": "",
            "canMoveUp": true,
            "canMoveDown": true,
            "children": []
          },
          {
            "value": 798,
            "title": "白名单和灰度验证成功",
            "menuPath": "validationPass",
            "menuType": 5,
            "menuVersion": "1.2.1",
            "isHidden": false,
            "menuPathFull": "tradeconfig/floors/validationPass",
            "menuOrder": 10,
            "menuIcon": "",
            "menuDesc": "",
            "canMoveUp": true,
            "canMoveDown": true,
            "children": []
          },
          {
            "value": 800,
            "title": "取消上线",
            "menuPath": "cancelOnline",
            "menuType": 5,
            "menuVersion": "1.2.1",
            "isHidden": false,
            "menuPathFull": "tradeconfig/floors/cancelOnline",
            "menuOrder": 11,
            "menuIcon": "",
            "menuDesc": "",
            "canMoveUp": true,
            "canMoveDown": true,
            "children": []
          },
          {
            "value": 817,
            "title": "白名单灰度发布审核弹框",
            "menuPath": "publishDialog",
            "menuType": 5,
            "menuVersion": "1.2.1",
            "isHidden": false,
            "menuPathFull": "tradeconfig/floors/publishDialog",
            "menuOrder": 12,
            "menuIcon": "",
            "menuDesc": "",
            "canMoveUp": true,
            "canMoveDown": true,
            "children": []
          },
          {
            "value": 822,
            "title": "上线审核(编辑楼层保存并发布)",
            "menuPath": "reviewEdit",
            "menuType": 5,
            "menuVersion": "1.2.1",
            "isHidden": false,
            "menuPathFull": "tradeconfig/floors/reviewEdit",
            "menuOrder": 13,
            "menuIcon": "",
            "menuDesc": "",
            "canMoveUp": true,
            "canMoveDown": true,
            "children": []
          },
          {
            "value": 823,
            "title": "全量发布审核弹框",
            "menuPath": "fullPublishDialog",
            "menuType": 5,
            "menuVersion": "1.2.1",
            "isHidden": false,
            "menuPathFull": "tradeconfig/floors/fullPublishDialog",
            "menuOrder": 14,
            "menuIcon": "",
            "menuDesc": "",
            "canMoveUp": true,
            "canMoveDown": true,
            "children": []
          },
          {
            "value": 824,
            "title": "下线楼层",
            "menuPath": "offlineFloor",
            "menuType": 5,
            "menuVersion": "1.2.1",
            "isHidden": false,
            "menuPathFull": "tradeconfig/floors/offlineFloor",
            "menuOrder": 15,
            "menuIcon": "",
            "menuDesc": "",
            "canMoveUp": true,
            "canMoveDown": true,
            "children": []
          },
          {
            "value": 882,
            "title": "测试",
            "menuPath": "xcxctest",
            "menuType": 5,
            "menuVersion": "1.2.1",
            "isHidden": false,
            "menuPathFull": "tradeconfig/floors/xcxctest",
            "menuOrder": 16,
            "menuIcon": "",
            "menuDesc": "",
            "canMoveUp": true,
            "canMoveDown": false,
            "children": []
          }
        ]
      },
      {
        "value": 1663,
        "title": "接口管理",
        "menuPath": "apiManage",
        "menuType": 5,
        "menuVersion": "1.2.4",
        "isHidden": false,
        "menuPathFull": "tradeconfig/apiManage",
        "menuOrder": 1,
        "menuIcon": "",
        "menuDesc": "",
        "canMoveUp": true,
        "canMoveDown": true,
        "children": [
          {
            "value": 1805,
            "title": "查看依赖规则名称",
            "menuPath": "viewRelatedRegulationName",
            "menuType": 5,
            "menuVersion": "1.2.4",
            "isHidden": false,
            "menuPathFull": "tradeconfig/apiManage/viewRelatedRegulationName",
            "menuOrder": 0,
            "menuIcon": "",
            "menuDesc": "",
            "canMoveUp": false,
            "canMoveDown": true,
            "children": []
          },
          {
            "value": 1810,
            "title": "创建依赖接口",
            "menuPath": "createDependentApi",
            "menuType": 5,
            "menuVersion": "1.2.4",
            "isHidden": false,
            "menuPathFull": "tradeconfig/apiManage/createDependentApi",
            "menuOrder": 1,
            "menuIcon": "",
            "menuDesc": "",
            "canMoveUp": true,
            "canMoveDown": true,
            "children": []
          },
          {
            "value": 1817,
            "title": "编辑依赖接口",
            "menuPath": "editDependentApi",
            "menuType": 5,
            "menuVersion": "1.2.4",
            "isHidden": false,
            "menuPathFull": "tradeconfig/apiManage/editDependentApi",
            "menuOrder": 2,
            "menuIcon": "",
            "menuDesc": "",
            "canMoveUp": true,
            "canMoveDown": true,
            "children": []
          },
          {
            "value": 1818,
            "title": "删除依赖接口",
            "menuPath": "deleteDependentApi",
            "menuType": 5,
            "menuVersion": "1.2.4",
            "isHidden": false,
            "menuPathFull": "tradeconfig/apiManage/deleteDependentApi",
            "menuOrder": 3,
            "menuIcon": "",
            "menuDesc": "",
            "canMoveUp": true,
            "canMoveDown": false,
            "children": []
          }
        ]
      },
      {
        "value": 1870,
        "title": "楼层数据依赖规则管理（线上）",
        "menuPath": "dependRegulationManage",
        "menuType": 5,
        "menuVersion": "1.2.4",
        "isHidden": false,
        "menuPathFull": "tradeconfig/dependRegulationManage",
        "menuOrder": 2,
        "menuIcon": "",
        "menuDesc": "",
        "canMoveUp": true,
        "canMoveDown": false,
        "children": [
          {
            "value": 1876,
            "title": "数据依赖规则列表（草稿）",
            "menuPath": "draftRegulationList",
            "menuType": 5,
            "menuVersion": "1.2.4",
            "isHidden": false,
            "menuPathFull": "tradeconfig/dependRegulationManage/draftRegulationList",
            "menuOrder": 0,
            "menuIcon": "",
            "menuDesc": "",
            "canMoveUp": false,
            "canMoveDown": true,
            "children": []
          },
          {
            "value": 1871,
            "title": "创建数据依赖规则",
            "menuPath": "createRegulation",
            "menuType": 5,
            "menuVersion": "1.2.4",
            "isHidden": false,
            "menuPathFull": "tradeconfig/dependRegulationManage/createRegulation",
            "menuOrder": 1,
            "menuIcon": "",
            "menuDesc": "",
            "canMoveUp": true,
            "canMoveDown": true,
            "children": []
          },
          {
            "value": 1872,
            "title": "编辑数据依赖规则",
            "menuPath": "editRegulation",
            "menuType": 5,
            "menuVersion": "1.2.4",
            "isHidden": false,
            "menuPathFull": "tradeconfig/dependRegulationManage/editRegulation",
            "menuOrder": 2,
            "menuIcon": "",
            "menuDesc": "",
            "canMoveUp": true,
            "canMoveDown": true,
            "children": []
          },
          {
            "value": 2086,
            "title": "查看关联楼层(线上可以查看)",
            "menuPath": "viewFloor",
            "menuType": 5,
            "menuVersion": "1.2.4",
            "isHidden": false,
            "menuPathFull": "tradeconfig/dependRegulationManage/viewFloor",
            "menuOrder": 3,
            "menuIcon": "",
            "menuDesc": "",
            "canMoveUp": true,
            "canMoveDown": true,
            "children": []
          },
          {
            "value": 1947,
            "title": "复制依赖规则 弃用",
            "menuPath": "copyRegulation",
            "menuType": 5,
            "menuVersion": "1.2.4",
            "isHidden": false,
            "menuPathFull": "tradeconfig/dependRegulationManage/copyRegulation",
            "menuOrder": 4,
            "menuIcon": "",
            "menuDesc": "",
            "canMoveUp": true,
            "canMoveDown": true,
            "children": []
          },
          {
            "value": 1946,
            "title": "删除规则",
            "menuPath": "deleteRegulation",
            "menuType": 5,
            "menuVersion": "1.2.4",
            "isHidden": false,
            "menuPathFull": "tradeconfig/dependRegulationManage/deleteRegulation",
            "menuOrder": 5,
            "menuIcon": "",
            "menuDesc": "",
            "canMoveUp": true,
            "canMoveDown": true,
            "children": []
          },
          {
            "value": 1895,
            "title": "数据依赖规则回滚",
            "menuPath": "rollback",
            "menuType": 5,
            "menuVersion": "1.2.4",
            "isHidden": false,
            "menuPathFull": "tradeconfig/dependRegulationManage/rollback",
            "menuOrder": 6,
            "menuIcon": "",
            "menuDesc": "",
            "canMoveUp": true,
            "canMoveDown": true,
            "children": []
          },
          {
            "value": 1879,
            "title": "依赖规则-发布（通用）",
            "menuPath": "publish",
            "menuType": 5,
            "menuVersion": "1.2.4",
            "isHidden": false,
            "menuPathFull": "tradeconfig/dependRegulationManage/publish",
            "menuOrder": 7,
            "menuIcon": "",
            "menuDesc": "",
            "canMoveUp": true,
            "canMoveDown": true,
            "children": []
          },
          {
            "value": 1880,
            "title": "数据依赖规则-白名单发布 弃用",
            "menuPath": "whiteList_create",
            "menuType": 5,
            "menuVersion": "1.2.4",
            "isHidden": false,
            "menuPathFull": "tradeconfig/dependRegulationManage/whiteList_create",
            "menuOrder": 8,
            "menuIcon": "",
            "menuDesc": "",
            "canMoveUp": true,
            "canMoveDown": true,
            "children": []
          },
          {
            "value": 1881,
            "title": "数据依赖规则-灰度发布 弃用",
            "menuPath": "gray_publish",
            "menuType": 5,
            "menuVersion": "1.2.4",
            "isHidden": false,
            "menuPathFull": "tradeconfig/dependRegulationManage/gray_publish",
            "menuOrder": 9,
            "menuIcon": "",
            "menuDesc": "",
            "canMoveUp": true,
            "canMoveDown": true,
            "children": []
          },
          {
            "value": 1882,
            "title": "数据依赖规则-全量发布 弃用",
            "menuPath": "full_publish",
            "menuType": 5,
            "menuVersion": "1.2.4",
            "isHidden": false,
            "menuPathFull": "tradeconfig/dependRegulationManage/full_publish",
            "menuOrder": 10,
            "menuIcon": "",
            "menuDesc": "",
            "canMoveUp": true,
            "canMoveDown": true,
            "children": []
          },
          {
            "value": 1883,
            "title": "数据依赖规则-取消发布 弃用",
            "menuPath": "unpublish",
            "menuType": 5,
            "menuVersion": "1.2.4",
            "isHidden": false,
            "menuPathFull": "tradeconfig/dependRegulationManage/unpublish",
            "menuOrder": 11,
            "menuIcon": "",
            "menuDesc": "",
            "canMoveUp": true,
            "canMoveDown": true,
            "children": []
          },
          {
            "value": 2060,
            "title": "数据依赖规则-验证成功（通用）",
            "menuPath": "verify-success",
            "menuType": 5,
            "menuVersion": "1.2.4",
            "isHidden": false,
            "menuPathFull": "tradeconfig/dependRegulationManage/verify-success",
            "menuOrder": 12,
            "menuIcon": "",
            "menuDesc": "",
            "canMoveUp": true,
            "canMoveDown": true,
            "children": []
          },
          {
            "value": 2061,
            "title": "创建规则-提交发布（普通）",
            "menuPath": "addAndSubmit",
            "menuType": 5,
            "menuVersion": "1.2.4",
            "isHidden": false,
            "menuPathFull": "tradeconfig/dependRegulationManage/addAndSubmit",
            "menuOrder": 13,
            "menuIcon": "",
            "menuDesc": "",
            "canMoveUp": true,
            "canMoveDown": true,
            "children": []
          },
          {
            "value": 2062,
            "title": "编辑规则-提交发布（普通）",
            "menuPath": "updateAndSubmit",
            "menuType": 5,
            "menuVersion": "1.2.4",
            "isHidden": false,
            "menuPathFull": "tradeconfig/dependRegulationManage/updateAndSubmit",
            "menuOrder": 14,
            "menuIcon": "",
            "menuDesc": "",
            "canMoveUp": true,
            "canMoveDown": true,
            "children": []
          },
          {
            "value": 2065,
            "title": "编辑规则发布（白名单发布）弃用",
            "menuPath": "updateAndSubmit_whiteList",
            "menuType": 5,
            "menuVersion": "1.2.4",
            "isHidden": false,
            "menuPathFull": "tradeconfig/dependRegulationManage/updateAndSubmit_whiteList",
            "menuOrder": 15,
            "menuIcon": "",
            "menuDesc": "",
            "canMoveUp": true,
            "canMoveDown": true,
            "children": []
          },
          {
            "value": 2084,
            "title": "修改复制规则名称并保存为草稿",
            "menuPath": "editCopyDraftName",
            "menuType": 5,
            "menuVersion": "1.2.4",
            "isHidden": false,
            "menuPathFull": "tradeconfig/dependRegulationManage/editCopyDraftName",
            "menuOrder": 16,
            "menuIcon": "",
            "menuDesc": "",
            "canMoveUp": true,
            "canMoveDown": false,
            "children": []
          }
        ]
      }
    ]
  },
  {
    "value": 789,
    "title": "运营配置",
    "menuPath": "operation",
    "menuType": 5,
    "menuVersion": "1.2.1",
    "isHidden": false,
    "menuPathFull": "operation",
    "menuOrder": 4,
    "menuIcon": "",
    "menuDesc": "",
    "canMoveUp": true,
    "canMoveDown": false,
    "children": [
      {
        "value": 885,
        "title": "模块配置",
        "menuPath": "moduleManage",
        "menuType": 5,
        "menuVersion": "1.2.3",
        "isHidden": false,
        "menuPathFull": "operation/moduleManage",
        "menuOrder": 0,
        "menuIcon": "",
        "menuDesc": "",
        "canMoveUp": false,
        "canMoveDown": false,
        "children": [
          {
            "value": 886,
            "title": "大促活动楼层",
            "menuPath": "PromotionManage",
            "menuType": 5,
            "menuVersion": "1.2.1",
            "isHidden": false,
            "menuPathFull": "operation/moduleManage/PromotionManage",
            "menuOrder": 0,
            "menuIcon": "",
            "menuDesc": "",
            "canMoveUp": false,
            "canMoveDown": true,
            "children": [
              {
                "value": 887,
                "title": "新建",
                "menuPath": "create",
                "menuType": 5,
                "menuVersion": "1.2.2",
                "isHidden": false,
                "menuPathFull": "operation/moduleManage/PromotionManage/create",
                "menuOrder": 0,
                "menuIcon": "",
                "menuDesc": "",
                "canMoveUp": false,
                "canMoveDown": true,
                "children": []
              },
              {
                "value": 891,
                "title": "强制关闭",
                "menuPath": "delete",
                "menuType": 5,
                "menuVersion": "1.2.1",
                "isHidden": false,
                "menuPathFull": "operation/moduleManage/PromotionManage/delete",
                "menuOrder": 1,
                "menuIcon": "",
                "menuDesc": "",
                "canMoveUp": true,
                "canMoveDown": true,
                "children": []
              },
              {
                "value": 955,
                "title": "复制活动",
                "menuPath": "copyActivity",
                "menuType": 5,
                "menuVersion": "1.2.1",
                "isHidden": false,
                "menuPathFull": "operation/moduleManage/PromotionManage/copyActivity",
                "menuOrder": 2,
                "menuIcon": "",
                "menuDesc": "",
                "canMoveUp": true,
                "canMoveDown": true,
                "children": []
              },
              {
                "value": 993,
                "title": "编辑",
                "menuPath": "modify",
                "menuType": 5,
                "menuVersion": "1.2.2",
                "isHidden": false,
                "menuPathFull": "operation/moduleManage/PromotionManage/modify",
                "menuOrder": 3,
                "menuIcon": "",
                "menuDesc": "",
                "canMoveUp": true,
                "canMoveDown": true,
                "children": []
              },
              {
                "value": 1442,
                "title": "查看",
                "menuPath": "m_detail",
                "menuType": 5,
                "menuVersion": "1.2.2",
                "isHidden": false,
                "menuPathFull": "operation/moduleManage/PromotionManage/m_detail",
                "menuOrder": 4,
                "menuIcon": "",
                "menuDesc": "",
                "canMoveUp": true,
                "canMoveDown": false,
                "children": []
              }
            ]
          },
          {
            "value": 889,
            "title": "业务支持楼层",
            "menuPath": "businessManage",
            "menuType": 5,
            "menuVersion": "1.2.2",
            "isHidden": false,
            "menuPathFull": "operation/moduleManage/businessManage",
            "menuOrder": 1,
            "menuIcon": "",
            "menuDesc": "",
            "canMoveUp": true,
            "canMoveDown": false,
            "children": [
              {
                "value": 890,
                "title": "新建",
                "menuPath": "create",
                "menuType": 5,
                "menuVersion": "1.2.2",
                "isHidden": false,
                "menuPathFull": "operation/moduleManage/businessManage/create",
                "menuOrder": 0,
                "menuIcon": "",
                "menuDesc": "",
                "canMoveUp": false,
                "canMoveDown": true,
                "children": []
              },
              {
                "value": 994,
                "title": "编辑",
                "menuPath": "m_edit",
                "menuType": 5,
                "menuVersion": "1.2.2",
                "isHidden": false,
                "menuPathFull": "operation/moduleManage/businessManage/m_edit",
                "menuOrder": 1,
                "menuIcon": "",
                "menuDesc": "",
                "canMoveUp": true,
                "canMoveDown": true,
                "children": []
              },
              {
                "value": 1171,
                "title": "复制",
                "menuPath": "copyBusiness",
                "menuType": 5,
                "menuVersion": "1.2.1",
                "isHidden": false,
                "menuPathFull": "operation/moduleManage/businessManage/copyBusiness",
                "menuOrder": 2,
                "menuIcon": "",
                "menuDesc": "",
                "canMoveUp": true,
                "canMoveDown": true,
                "children": []
              },
              {
                "value": 1172,
                "title": "强制关闭",
                "menuPath": "delete",
                "menuType": 5,
                "menuVersion": "1.2.1",
                "isHidden": false,
                "menuPathFull": "operation/moduleManage/businessManage/delete",
                "menuOrder": 3,
                "menuIcon": "",
                "menuDesc": "",
                "canMoveUp": true,
                "canMoveDown": true,
                "children": []
              },
              {
                "value": 1439,
                "title": "查看",
                "menuPath": "m_detail",
                "menuType": 5,
                "menuVersion": "1.2.2",
                "isHidden": false,
                "menuPathFull": "operation/moduleManage/businessManage/m_detail",
                "menuOrder": 4,
                "menuIcon": "",
                "menuDesc": "",
                "canMoveUp": true,
                "canMoveDown": false,
                "children": []
              }
            ]
          }
        ]
      }
    ]
  }
]

//  function CCMSEditor (props: AppProps) {
  console.log('ccms-editor0')
    // return (
      // <App
      //   applicationName="example"
      //   type="application"
      //   version={"1.0.0"} // 后面改为appInfo.version
      //   subversion="0"
      //   config={props.config || DefaultConfig}
      //   sourceData={props.sourceData}
      //   onChange={(v)=>{console.log('ccms-editor', v)}}
      //   baseRoute={'/'}
      //   checkPageAuth={async (_) => true}
      //   loadPageURL={async (_) => '#'}
      //   loadPageFrameURL={async (_) => '#'}
      //   loadPageConfig={async (param) => {
      //     console.log('param--ed', param);
      //     return({
      //       steps: [
      //         {
      //           type: 'form',
      //           fields: [
      //             {
      //               field: 'text2',
      //               label: 'text2',
      //               type: 'text'
      //             }
      //           ],
      //           "actions": []
      //         }
      //       ]
      //   })}}
      //   loadPageList={props.loadPageList}
      //   loadDomain={async () => ''}
      //   onSubmit={(config) => console.log(JSON.stringify(config, undefined, 2))}
      //   onCancel={() => {}}
      // />
    // )
// }
const render = () => {


ReactDOM.render(<App
  applicationName="example"
  type="application"
  version={"1.0.0"} // 后面改为appInfo.version
  subversion="0"
  config={DefaultConfig}
  sourceData={{}}
  onChange={(v)=>{console.log('ccms-editor', v)}}
  baseRoute={'/'}
  checkPageAuth={async (_) => true}
  loadPageURL={async (_) => '#'}
  loadPageFrameURL={async (_) => '#'}
  loadPageConfig={async (param) => {
    console.log('param--ed', param);
    return({
      steps: [
        {
          type: 'form',
          fields: [
            {
              field: 'text2',
              label: 'text2',
              type: 'text'
            }
          ],
          "actions": []
        }
      ]
  })}}
  loadPageList={async ()=> treeData}
  loadDomain={async () => ''}
  onSubmit={(config) => console.log(JSON.stringify(config, undefined, 2))}
  onCancel={() => {}}
/>, document.getElementById('root'))
}
render()