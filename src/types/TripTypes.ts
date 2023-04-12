export type TripDataInput = {
  ['title']: string;
  ['point_coords']: number[][];
  ['details']: {
    ['distance']: string;
    ['duration']: string;
    ['average_speed']: string;
    ['start_time']: number;
    ['end_time']: number;
  };
};

export type ResponseTripData = TripDataInput & {
  user: {};
  id: string;
  media: { [coords: string]: string[] } | undefined;
};

export type TripData = {
  id: number;
  item: ResponseTripData;
};
