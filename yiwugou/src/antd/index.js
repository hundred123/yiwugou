import 'ant-design-vue/dist/antd.variable.min.css';

import Input from 'ant-design-vue/lib/input';
import List from 'ant-design-vue/lib/list';
import Spin from 'ant-design-vue/lib/spin';
import Button from 'ant-design-vue/lib/button';
import Carousel from 'ant-design-vue/lib/carousel'
import Skeleton from 'ant-design-vue/lib/skeleton'
import Avatar from 'ant-design-vue/lib/avatar';
import ConfigProvider from 'ant-design-vue/lib/config-provider'
import Form from 'ant-design-vue/lib/form'
import Upload from 'ant-design-vue/lib/upload'
import message from 'ant-design-vue/lib/message'
import Tabs from 'ant-design-vue/lib/tabs'
import CheckBox from 'ant-design-vue/lib/checkbox'
import Empty from 'ant-design-vue/lib/empty'
import Dropdown from 'ant-design-vue/lib/dropdown'
import Menu from 'ant-design-vue/lib/menu'

export const useAntd = (app) => {
    ConfigProvider.config({
        theme: {
            primaryColor: '#FF6600',
        },
    });
    message.config({
        top: '120px',
				duration:.5
    })
		app.provide('$message', message)
    app.use(Input)
    app.use(List)
    app.use(Spin)
    app.use(Button)
    app.use(Carousel)
    app.use(Skeleton)
    app.use(Form)
    app.use(Avatar)
    app.use(Upload)
    app.use(Tabs)
    app.use(CheckBox)
    app.use(Empty)
    app.use(Dropdown)
    app.use(Menu)
}