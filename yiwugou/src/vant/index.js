import 'vant/lib/index.css';
import { Icon } from 'vant';
import Card from 'vant/lib/card'
import AddressEdit from 'vant/lib/address-edit'
import AddressList from 'vant/lib/address-list'
import Tag from 'vant/lib/tag'
import Badge from 'vant/lib/badge'
export const useVant=(app)=>{
	app.use(Card)
	app.use(AddressEdit)
	app.use(AddressList)
	app.use(Icon);
	app.use(Tag);
	app.use(Badge);
}