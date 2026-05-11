export interface TimePoint {
  matched_value: string;
  matched_type: string;
  label: string;
  uri: string;
}

export interface TimeSeries {
  start?: TimePoint;
  end?: TimePoint;
  periods?: TimePoint[];
}

export interface TemporalEntity {
  text: string;
  label: string;
  time_series: TimeSeries[];
}

export interface NormalizeResponse {
  text: string;
  entities: TemporalEntity[];
}
