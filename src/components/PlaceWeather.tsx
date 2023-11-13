import { useFetch } from "@raycast/utils";
import { HTMLElement, parse } from "node-html-parser";
import { DailyWeatherSummary } from "../models/weather";
import { Color, Icon, List, LocalStorage } from "@raycast/api";
import { Place } from "../models/place";
import { useState } from "react";

interface PlaceWeatherResult {
  today: DailyWeatherSummary;
  tomorrow: DailyWeatherSummary;
  week: DailyWeatherSummary[];
}

interface PlaceWeatherProps {
  place: Place;
}

export default function PlaceWeather(props: PlaceWeatherProps) {
  LocalStorage.setItem(props.place.name, JSON.stringify(props.place));

  const [result, setResult] = useState<PlaceWeatherResult | null>(null);
  const { isLoading } = useFetch(props.place.path, {
    parseResponse: async (response) => {
      const body = await response.text();
      const root = parse(body);
      setResult(() => ({
        today: DailyWeatherSummary.parseDayWeather(root.querySelector("#yjw_pinpoint_today") as HTMLElement),
        tomorrow: DailyWeatherSummary.parseDayWeather(root.querySelector("#yjw_pinpoint_tomorrow") as HTMLElement),
        week: DailyWeatherSummary.parseWeekWeather(root),
      }));
    },
  });

  if (isLoading || !result) {
    return <List isLoading={true} />;
  }

  return (
    <List navigationTitle={props.place.name}>
      <List.Section title="今日の天気">
        <List.Item
          title={result.today.date}
          keywords={["今日の天気", "today"]}
          accessories={[
            { tag: { value: `${result.tomorrow.highestTemp}℃`, color: Color.Red } },
            { tag: { value: `${result.tomorrow.lowestTemp}℃`, color: Color.Blue } },
          ]}
        />
      </List.Section>
      <List.Section title="明日の天気">
        <List.Item
          title={result.tomorrow.date}
          keywords={["明日の天気", "tomorrow"]}
          accessories={[
            { tag: { value: `${result.tomorrow.highestTemp}℃`, color: Color.Red } },
            { tag: { value: `${result.tomorrow.lowestTemp}℃`, color: Color.Blue } },
          ]}
        />
      </List.Section>
      <List.Section title="週間天気">
        {result.week.map((day) => (
          <List.Item
            title={day.date}
            key={day.date}
            subtitle={day.outline}
            accessories={[
              { tag: { value: `${day.highestTemp}℃`, color: Color.Red } },
              { tag: { value: `${day.lowestTemp}℃`, color: Color.Blue } },
              { tag: { value: `${day.rainProbability}%`, color: Color.Purple }, icon: Icon.Raindrop },
            ]}
          />
        ))}
      </List.Section>
    </List>
  );
}
