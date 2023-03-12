export class createJadwalDto {
  id: string;
  date: string;
  time: string;
  is_PraktikumSchedule: boolean;
  location: string;
  praktikan_group: object;
  shift: object;
  praktikum_name: string;
  reason: string;
  tools: object;
  created_at: string;
  edited_at: string;
}
export type createJadwalParams = {
  id: string;
  date: string;
  time: string;
  is_PraktikumSchedule: boolean;
  location: string;
  praktikan_group: object;
  shift: object;
  praktikum_name: string;
  reason: string;
  tools: object;
  created_at: string;
  edited_at: string;
};
