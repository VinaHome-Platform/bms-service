export class DTO_RQ_CreateOffice {
  name: string;
  code: string;
  address: string;
  note: string;
  status: boolean;
  phones: DTO_RQ_OfficePhone[];
  company_id: number;
}
export class DTO_RQ_OfficePhone {
  id: number;
  phone: string;
  type: string;
}

export class DTO_RP_Office {
  id: number;
  name: string;
  code: string;
  address: string;
  note: string;
  status: boolean;
  created_at: Date;
  phones: DTO_RP_OfficePhone[];
}
export class DTO_RP_OfficePhone {
  id: number;
  phone: string;
  type: string;
}

export class DTO_RQ_UpdateOffice {
  name: string;
  code: string;
  address: string;
  note: string;
  status: boolean;
  phones: DTO_RQ_OfficePhone[];
  company_id: number;
}
