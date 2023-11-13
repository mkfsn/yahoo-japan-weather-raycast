import { List } from "@raycast/api";
import { useState } from "react";
import FavoritePlaces from "./components/FavoritePlaces";
import SearchPlaces from "./components/SearchPlaces";
import { Place } from "./models/place";
import fetch from "node-fetch";

export default function Command() {
  const [places, setPlaces] = useState<Place[]>([]);

  const searchSuggest = async (searchText: string, callback: (places: Place[]) => void) => {
    const url = encodeURI("https://img-weather.c.yimg.jp/weather/search/suggest/?q=" + searchText);
    const resp = await fetch(url);
    const places = (JSON.parse(await resp.text()) as { id: string; suggestItems: Place[] }).suggestItems;
    callback(places);
  };

  const onSearchTextChange = async (searchText: string) => {
    if (searchText === "") {
      setPlaces([]);
      return;
    }
    await searchSuggest(searchText, (places) => {
      setPlaces(() => places);
    });
  };

  return (
    <List
      onSearchTextChange={(query) => onSearchTextChange(query)}
      searchBarPlaceholder="地名・施設名・郵便番号を入力"
      throttle={true}
    >
      <SearchPlaces places={places} />
      <FavoritePlaces />
    </List>
  );
}
