/**
 * 季报中, 用于显示 总交易金额/为用户赚取/累计交易/A轮融资 等单个信息的组件
 * Created by jess on 2016/9/28.
 */




const moment = require('moment');

const numeral = require('numeral');

const glpbCommon = require('glpb-components-common');

const serviceFactory = require('../../service/service-factory.js');

require('./report-total-item.scss');

const BaseComponent = glpbCommon.BaseComponent;

const $ = BaseComponent.$;

const utils = BaseComponent.utils;


const tpl = `<div><div class="glpb-content"></div></div>`;



const ReportTotalItem = BaseComponent.extend(
    {
        componentName : 'glpb_m_we_com_report_total_item',
        componentNameZh : '总交易金额区块',
        componentCategory : BaseComponent.CATEGORY.UI,
        platform : BaseComponent.PLATFORM.MOBILE,
        canBeChildOfComponentName : function(){
            return true;
        }
    },
    {
        getDefaultStyle : function(){
            return {
                background : {
                    backgroundColor : 'transparent'
                },
                height: '2.7rem',
                padding : '0.63rem 0 0 0.92rem',
                margin : '0'
            };
        },

        getDefaultData : function(){
            return {
                "exchangeIdList_$$comment" : '输入要显示的多个交易所ID',
                exchangeIdList : []
            };
        },

        getDefaultComponents : function(){
            return [
                {
                    componentName : 'glpb_rich_text',
                    data : '205亿元',
                    style : {
                        color : '#fff',
                        fontSize : '15px',
                        marginBottom : '0.06rem'
                    }
                },
                {
                    componentName : 'glpb_rich_text',
                    data : '总交易金额',
                    style : {
                        color : '#fff',
                        fontSize : '13px'
                    }
                }
            ];
        },

        init : function(){
            //当前Ajax请求的ID
            this.querySign = null;
            //是否已经绑定了组件自定义事件
        },

        render : function(){
            let currentComponentId = this.componentId;
            let data = this.data;

            let cssClass = this.getBaseCssClass() + '  ';
            let cssStyle = this.translateStyle( this.style );
            let $el = $(tpl).addClass( cssClass ).css( cssStyle );;
            let $content = $('.glpb-content', $el);

            this.$el = $el;
            this.$content = $content;

            let components = this.components || [];
            let componentRefs = this.componentRefs;
            for( var i = 0, len = components.length; i < len; i++ ){
                let config = components[i];
                config.parentId = currentComponentId;
                let com = this.page.createComponentInstance( config );
                if( com ){
                    com.render();
                    $content.append( com.$getElement() );
                    componentRefs.push( com );
                }else{
                    //不存在该组件
                    throw new Error(`componentName[${config.componentName}]对应的组件不存在!!`);
                }
            }

        },

        componentWillUnmount : function(){
            this.$content = null;
        }


    }
);


module.exports = ReportTotalItem;


