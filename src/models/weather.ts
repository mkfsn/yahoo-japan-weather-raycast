import { HTMLElement } from "node-html-parser";

export class HourlyWeatherSummary {
  public hour: string = "";
  public outline: string = "";
  public temperature: number | undefined;
  public humidity: number | undefined;
  public rainfall: number | undefined;
}

export class DailyWeatherSummary {
  public date: string = "";
  public outline: string = "";
  private _highestTemp: number | undefined;
  private _lowestTemp: number | undefined;
  public rainProbability: number | undefined;
  public hourly: HourlyWeatherSummary[];
  static parseDayWeather: (dom: HTMLElement) => DailyWeatherSummary;
  static parseWeekWeather: (dom: HTMLElement) => DailyWeatherSummary[];

  constructor(hourly: HourlyWeatherSummary[] = []) {
    this.hourly = hourly;
  }

  set highestTemp(value: number) {
    this._highestTemp = value;
  }

  get highestTemp(): number | undefined {
    if (this._highestTemp) {
      return this._highestTemp;
    }
    if (this.hourly.length > 0) {
      return Math.max(...this.hourly.map((v) => v.temperature as number));
    }
    return undefined;
  }

  set lowestTemp(value: number) {
    this._lowestTemp = value;
  }

  get lowestTemp(): number | undefined {
    if (this._lowestTemp) {
      return this._lowestTemp;
    }
    if (this.hourly.length > 0) {
      return Math.min(...this.hourly.map((v) => v.temperature as number));
    }
    return undefined;
  }
}

DailyWeatherSummary.parseDayWeather = function (dom: HTMLElement): DailyWeatherSummary {
  const result = new DailyWeatherSummary([...Array(8)].map(() => new HourlyWeatherSummary()));

  const date = dom?.querySelector("h3:nth-child(1) > span")?.innerText.trim();
  result.date = date ? date.replace(/[ -]/g, "") : "";

  const tableBody = dom?.querySelector("table tbody");

  tableBody?.querySelectorAll("tr:nth-child(1) td:nth-of-type(n+2)").forEach((e, i) => {
    const text = e.innerText.trim().replace(/[ \n]/g, "");
    result.hourly[i].hour = text;
  });

  tableBody?.querySelectorAll("tr:nth-child(2) td:nth-of-type(n+2)").forEach((e, i) => {
    const text = e.innerText.trim().replace(/[ \n]/g, "");
    result.hourly[i].outline = text;
  });

  tableBody?.querySelectorAll("tr:nth-child(3) td:nth-of-type(n+2)").forEach((e, i) => {
    const text = e.innerText.trim().replace(/[ \n]/g, "");
    result.hourly[i].temperature = parseInt(text);
  });

  tableBody?.querySelectorAll("tr:nth-child(4) td:nth-of-type(n+2)").forEach((e, i) => {
    const text = e.innerText.trim().replace(/[ \n]/g, "");
    result.hourly[i].humidity = parseInt(text);
  });

  tableBody?.querySelectorAll("tr:nth-child(5) td:nth-of-type(n+2)").forEach((e, i) => {
    const text = e.innerText.trim().replace(/[ \n]/g, "");
    result.hourly[i].rainfall = parseInt(text);
  });

  return result;
};

DailyWeatherSummary.parseWeekWeather = function (root: HTMLElement): DailyWeatherSummary[] {
  const dom = root.querySelector("#yjw_week");
  const tableBody = dom?.querySelector("table tbody");

  const results: DailyWeatherSummary[] = [...Array(6)].map(() => new DailyWeatherSummary());

  tableBody?.querySelectorAll("tr:nth-child(1) td:nth-of-type(n+2)").forEach((e, i) => {
    const text = e.innerText.trim().replace(/[ \n]/g, "");
    results[i].date = text;
  });

  tableBody?.querySelectorAll("tr:nth-child(2) td:nth-of-type(n+2)").forEach((e, i) => {
    const text = e.innerText.trim().replace(/[ \n]/g, "");
    results[i].outline = text;
  });

  tableBody?.querySelectorAll("tr:nth-child(3) td:nth-of-type(n+2)").forEach((e, i) => {
    const [high, low] = e.querySelectorAll("font");
    results[i].highestTemp = parseInt(high.innerText.trim());
    results[i].lowestTemp = parseInt(low.innerText.trim());
  });

  tableBody?.querySelectorAll("tr:nth-child(4) td:nth-of-type(n+2)").forEach((e, i) => {
    const text = e.innerText.trim().replace(/[ \n]/g, "");
    results[i].rainProbability = parseInt(text);
  });

  return results;
};
