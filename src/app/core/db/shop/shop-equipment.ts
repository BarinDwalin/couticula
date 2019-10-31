import { ItemType } from '@enums';

export const ShopEquipments = {
  equipment: [
    {
      itemType: ItemType.Weapon,
      name: 'Оружие',
      img: 'assets/img/items/weapon.jpg',
      items: [
        { value: 1, cost: 100 },
        { value: 2, cost: 200 },
        { value: 3, cost: 400 },
        { value: 4, cost: 600 },
        { value: 5, cost: 700 },
        { value: 6, cost: 900 },
      ],
    },
    {
      itemType: ItemType.Head,
      name: 'Голова',
      img: 'assets/img/items/head.jpg',
      items: [
        { value: 1, cost: 100 },
        { value: 2, cost: 300 },
        { value: 3, cost: 400 },
        { value: 4, cost: 500 },
        { value: 5, cost: 700 },
        { value: 6, cost: 800 },
      ],
    },
    {
      itemType: 3,
      name: 'Руки',
      img: 'assets/img/items/hands.jpg',
      items: [
        { value: 1, cost: 100 },
        { value: 2, cost: 200 },
        { value: 3, cost: 300 },
        { value: 4, cost: 400 },
        { value: 5, cost: 500 },
        { value: 6, cost: 600 },
      ],
    },
    {
      itemType: 5,
      name: 'Тело',
      img: 'assets/img/items/body.jpg',
      items: [
        { value: 1, cost: 200 },
        { value: 2, cost: 300 },
        { value: 3, cost: 500 },
        { value: 4, cost: 700 },
        { value: 5, cost: 900 },
        { value: 6, cost: 1200 },
      ],
    },
    {
      itemType: 4,
      name: 'Ноги',
      img: 'assets/img/items/legs.jpg',
      items: [
        { value: 1, cost: 100 },
        { value: 2, cost: 200 },
        { value: 3, cost: 300 },
        { value: 4, cost: 400 },
        { value: 5, cost: 500 },
        { value: 6, cost: 600 },
      ],
    },
  ],
  hitpoints: {
    img: 'assets/img/hitpoints.jpg',
    items: [
      { value: 10, cost: 200 },
      { value: 15, cost: 300 },
      { value: 20, cost: 500 },
      { value: 30, cost: 700 },
      { value: 50, cost: 1000 },
      { value: 70, cost: 1500 },
    ],
  },
};
