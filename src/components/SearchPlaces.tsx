import { Action, ActionPanel, Color, List } from "@raycast/api";
import PlaceWeather from "./PlaceWeather";
import { Place } from "../models/place";

interface SearchPlacesProps {
  places: Place[];
}

export default function SearchPlaces(props: SearchPlacesProps) {
  return (
    <List.Section title="Results">
      {props.places.map((place) => (
        <List.Item
          key={place.name}
          title={place.name}
          subtitle={place.address}
          accessories={[{ tag: { value: place.type, color: Color.Blue } }]}
          actions={
            <ActionPanel>
              <Action.Push title="Check Weather" target={<PlaceWeather place={place} />} />
            </ActionPanel>
          }
        />
      ))}
    </List.Section>
  );
}
