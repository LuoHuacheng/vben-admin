import type { App } from 'vue';
import { Icon as XIcon } from './Icon';
import { Button as XButton } from './Button';

const compList = [XButton, XIcon];

export function registerGlobComp(app: App) {
  compList.forEach((comp) => {
    app.component(comp.name, comp);
  });
}
