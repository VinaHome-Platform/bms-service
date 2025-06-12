export class DTO_RQ_CreateCompany {
  name: string;
  phone: string;
  address: string;
  tax_code: string;
  status: boolean;
  url_image: string;
  code: string;
  note: string;
}
export class DTO_RQ_UpdateCompany {
  name: string;
  phone: string;
  address: string;
  tax_code: string;
  status: boolean;
  url_image: string;
  code: string;
  note: string;
}
export class DTO_RP_Company {
  id: number;
  name: string;
  phone: string;
  address: string;
  tax_code: string;
  status: boolean;
  url_image: string;
  code: string;
  note: string;
  created_at: Date;
}
