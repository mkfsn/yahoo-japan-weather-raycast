import { Action, ActionPanel, Color, Icon, List, LocalStorage } from "@raycast/api";
import PlaceWeather from "./PlaceWeather";
import { Place } from "../models/place";
import { usePromise } from "@raycast/utils";

export default function FavoritePlaces() {
  const { isLoading, data, revalidate } = usePromise(
    async () => {
      const items = await LocalStorage.allItems();
      console.log("items:", items);
      return Object.values(items).map((v) => JSON.parse(v) as Place);
    },
    [],
    {},
  );

  console.log("FavoritePlaces");

  return (
    <List.Section title="Favorites">
      {!isLoading &&
        data?.map((place) => (
          <List.Item
            key={place.name}
            title={place.name}
            subtitle={place.address}
            icon={Icon.Star}
            accessories={[{ tag: { value: place.type, color: Color.Blue } }]}
            actions={
              <ActionPanel>
                <Action.Push title="Check Weather" target={<PlaceWeather place={place} />} />
                <Action
                  title="Remove Place"
                  onAction={async () => {
                    await LocalStorage.removeItem(place.name);
                    await revalidate();
                  }}
                />
              </ActionPanel>
            }
          />
        ))}
    </List.Section>
  );
}
