import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from '../company/company.entity';
import { Repository } from 'typeorm';
import { Route } from './route.entity';
import { DTO_RQ_CreateRoute } from './route.dto';

@Injectable()
export class RouteService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,

    @InjectRepository(Route)
    private readonly routeRepository: Repository<Route>,
  ) {}

  async createRoute(data: DTO_RQ_CreateRoute) {
    console.log('Received data for createRoute:', data);
    const company = await this.companyRepository.findOne({
      where: { id: data.company_id },
    });

    if (!company) {
      throw new NotFoundException('Công ty không tồn tại');
    }
    const existingRoute = await this.routeRepository.findOne({
      where: {
        route_name: data.route_name,
        company: { id: data.company_id },
      },
      relations: ['company'],
    });
    if (existingRoute) {
      throw new ConflictException('Tên tuyến đã tồn tại.');
    }
    const route = this.routeRepository.create({
      base_price: data.base_price,
      company: company,
      created_by: data.created_by,
      distance: data.distance,
      e_ticket_price: data.e_ticket_price,
      journey: data.journey,
      note: data.note,
      route_name: data.route_name,
      route_name_e_ticket: data.route_name_e_ticket,
      short_name: data.short_name,
      status: data.status,
    });
    const savedRoute = await this.routeRepository.save(route);
    return {
      id: savedRoute.id,
      base_price: savedRoute.base_price,
      created_by: savedRoute.created_by,
      distance: savedRoute.distance,
      e_ticket_price: savedRoute.e_ticket_price,
      journey: savedRoute.journey,
      note: savedRoute.note,
      route_name: savedRoute.route_name,
      route_name_e_ticket: savedRoute.route_name_e_ticket,
      short_name: savedRoute.short_name,
      status: savedRoute.status,
      created_at: savedRoute.created_at,
    };
  }

  async getListRouteByCompany(id: number) {
    const company = await this.companyRepository.findOne({
      where: { id: id },
    });

    if (!company) {
      throw new NotFoundException('Công ty không tồn tại');
    }

    const routes = await this.routeRepository.find({
      where: { company: { id: id } },
      order: { created_at: 'DESC' },
    });

    return routes.map((route) => ({
      id: route.id,
      base_price: route.base_price,
      created_by: route.created_by,
      distance: route.distance,
      e_ticket_price: route.e_ticket_price,
      journey: route.journey,
      note: route.note,
      route_name: route.route_name,
      route_name_e_ticket: route.route_name_e_ticket,
      short_name: route.short_name,
      status: route.status,
      created_at: route.created_at,
    }));
  }
}
