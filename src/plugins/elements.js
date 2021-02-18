import Vue from 'vue';
import 'element-ui/lib/theme-chalk/index.css'
import {MessageBox,Button,Form,FormItem,Input,Container,Header,Aside,Main,Submenu,Menu,MenuItem,Breadcrumb,BreadcrumbItem,Card,TableColumn,Table,Switch,Tooltip,Pagination,Dialog,Tag,Row,Col,Tree,Select,Option,Cascader,Alert,Tabs,
  TabPane,Steps,Step,CheckboxGroup,Checkbox,Upload
} from 'element-ui';
Vue.prototype.messageBox = MessageBox;
Vue.use(Button);Vue.use(Form);Vue.use(FormItem);Vue.use(Input);Vue.use(Container);Vue.use(Header);Vue.use(Aside);Vue.use(Main);Vue.use(Submenu);Vue.use(Menu);Vue.use(MenuItem);Vue.use(Breadcrumb);Vue.use(BreadcrumbItem);Vue.use(Card);Vue.use(TableColumn);Vue.use(Table);Vue.use(Switch);Vue.use(Tooltip);Vue.use(Pagination);Vue.use(Dialog);Vue.use(Tag);Vue.use(Row);Vue.use(Col);Vue.use(Tree);Vue.use(Select);Vue.use(Option);Vue.use(Cascader);Vue.use(Alert);Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Steps);
Vue.use(Step);
Vue.use(CheckboxGroup);
Vue.use(Checkbox);
Vue.use(Upload);