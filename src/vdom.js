const TEXT_NODE_TYPE = 3;

export default class VDOM {
  static patchChildren(parent, vChildren, nextVChildren) {
    parent.childNodes.forEach((childNode, i) => {
      this.patchNode(childNode, vChildren[i], nextVChildren[i]);
    });

    nextVChildren.slice(vChildren.length).forEach((vChild) => {
      parent.appendChild(this.createDOMNode(vChild));
    });
  }

  static patchProp(node, key, value, nextValue) {
    // Если новое значение не задано, то удаляем атрибут
    if (nextValue == null || nextValue === false) {
      node.removeAttribute(key);
      return;
    }

    if (key.startsWith("on")) {
      const eventName = key.slice(2);

      node[eventName] = nextValue;
      console.log(node, key, value, nextValue);
      if (!nextValue) {
        node.removeEventListener(eventName, this.#listener);
      } else if (!value) {
        node.addEventListener(eventName, this.#listener);
      }
      return;
    }
    // Устанавливаем новое значение атрибута
    node.setAttribute(key, nextValue);
  }

  static patchProps(node, props, nextProps) {
    // Объект с общими свойствами
    const mergedProps = { ...props, ...nextProps };

    Object.keys(mergedProps).forEach((key) => {
      // Если значение не изменилось, то ничего не обновляем
      if (props[key] !== nextProps[key]) {
        this.patchProp(node, key, props[key], nextProps[key]);
      }
    });
  }

  static patchNode(node, vNode, nextVNode) {
    // Удаляем ноду, если значение nextVNode не задано
    if (nextVNode === undefined) {
      node.remove();
      return;
    }

    if (typeof vNode === "string" || typeof nextVNode === "string") {
      // Заменяем ноду на новую, если как минимум одно из значений равно строке
      // и эти значения не равны друг другу
      if (vNode !== nextVNode) {
        const nextNode = this.createDOMNode(nextVNode);
        node.replaceWith(nextNode);
        return nextNode;
      }

      // Если два значения - это строки и они равны,
      // просто возвращаем текущую ноду
      return node;
    }

    // Заменяем ноду на новую, если теги не равны
    if (vNode.tagName !== nextVNode.tagName) {
      const nextNode = this.createDOMNode(nextVNode);
      node.replaceWith(nextNode);
      return nextNode;
    }

    // Патчим свойства
    this.patchProps(node, vNode.props, nextVNode.props);

    // Патчим детей
    this.patchChildren(node, vNode.children, nextVNode.children);

    // Возвращаем обновленный DOM-элемент
    return node;
  }

  static createDOMNode(vNode) {
    if (typeof vNode === "string") {
      return document.createTextNode(vNode);
    }

    const { tagName, props, children } = vNode;

    const node = document.createElement(tagName);
    this.patchProps(node, {}, props);

    children.forEach((child) => {
      node.appendChild(this.createDOMNode(child));
    });

    return node;
  }

  static createVNode(tagName, props = {}, children = []) {
    return {
      tagName,
      props,
      children,
    };
  }

  static mount(node, target) {
    target.replaceWith(node);
    return node;
  }

  static patch(nextVNode, node) {
    console.log("PATCH");
    // Получаем текущее виртуальное дерево из DOM-ноды
    const vNode = node.v || this.#recycleNode(node);
    // Патчим DOM-ноду
    node = this.patchNode(node, vNode, nextVNode);
    // Сохраняем виртуальное дерево в DOM-ноду
    node.v = nextVNode;

    return node;
  }

  static #recycleNode(node) {
    // Если текстовая нода - то возвращаем текст
    if (node.nodeType === TEXT_NODE_TYPE) {
      return node.nodeValue;
    }

    //  Получаем имя тега
    const tagName = node.nodeName.toLowerCase();

    // Рекурсивно обрабатываем дочерние ноды
    const children = [].map.call(node.childNodes, this.#recycleNode);

    // Создаем виртуальную ноду
    return this.createVNode(tagName, {}, children);
  }

  static #listener(event) {
    return this[event.type](event);
  }
}
