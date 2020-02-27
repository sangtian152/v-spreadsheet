import { h } from './element';
import { bindClickoutside, unbindClickoutside } from './event';
import { cssPrefix } from '../config';
import { tf } from '../locale/locale';

const menuItems = [
  { key: 'copy', title: 'copy' },
  { key: 'cut', title: 'cut' },
  { key: 'paste', title: 'paste' },
  { key: 'paste-value', title: 'pasteValue' },
  { key: 'paste-format', title: 'pasteFormat' },
];

function buildMenuItem(item, props) {
  let tKey = 'title';
  let vKey = 'key';
  if(props instanceof Object){
    if(props.label) { tkey = props.label; }
    if(props.value) { vKey = props.value; }
  }
  return h('div', `${cssPrefix}-selectItem`)
    .on('click', () => {
      this.itemClick(item[vKey],item[tKey]);
      this.hide();
    })
    .children(
      item[tKey],
      h('div', 'label').child(item.label || ''),
    );
}

function buildMenu(items, props) {
  const { selectbEl } = this;
  selectbEl.html('')
  if(items.length > 0){
    let menu = items.map(it => buildMenuItem.call(this, it, props))
    selectbEl.children(...menu);
  }else{
    selectbEl.child(h('div', `${cssPrefix}-empty`).html('暂无数据'));
  }
}

export default class SelectMenu {
  constructor(viewFn, isHide = false) {
    this.selectbEl = h('div', `${cssPrefix}-select-body`);
    this.el = h('div', `${cssPrefix}-selectmenu`)
      .children(this.selectbEl)
      .hide();
      // .children(...buildMenu.call(this, menuItems))
    this.viewFn = viewFn;
    // this.itemClick = () => {};
    this.isHide = isHide;
  }
  itemClick(value, txt){
    if(this.ok){
      this.ok(value, txt)
    }
  }
  set(items, selected, props) {
    items = items || menuItems
    buildMenu.call(this, items, selected, props);
  }
  hide() {
    const { el } = this;
    el.hide();
    unbindClickoutside(el);
  }

  setPosition(x, y, h) {
    if (this.isHide) return;
    const { el } = this;
    const { height, width } = el.show().offset();
    const view = this.viewFn();
    let top = y + h + 2;
    let left = x;
    if (view.height - y <= height) {
      top -= (height + h + 2);
      top = top < 0 ? 0 : top;
    }
    if (view.width - x <= width) {
      left -= width;
    }
    el.offset({ left, top });
    bindClickoutside(el);
  }
}
