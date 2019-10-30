export class Statistic {
  creatureName: string;
  kills: number;

  constructor(name: string, kills: number) {
    this.creatureName = name;
    this.kills = kills;
  }
}
