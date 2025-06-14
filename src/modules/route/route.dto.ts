export class DTO_RQ_CreateRoute {
  base_price: number;
  company_id: number;
  created_by: string;
  distance: number;
  e_ticket_price: number;
  journey: string;
  note: string;
  route_name: string;
  route_name_e_ticket: string;
  short_name: string;
  status: boolean;
}
export class DTO_RP_Route {
  id: number;
  base_price: number;
  company_id: number;
  created_by: string;
  distance: number;
  e_ticket_price: number;
  journey: string;
  note: string;
  route_name: string;
  route_name_e_ticket: string;
  short_name: string;
  status: boolean;
  created_at: Date;
}
