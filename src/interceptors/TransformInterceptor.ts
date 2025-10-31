/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class JsonApiInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: any) => {
        // Aquí transformas tu respuesta al formato JSON:API
        if (!data) return null;

        return {
          links: {
            self: context.switchToHttp().getRequest().url,
          },
          data: Array.isArray(data)
            ? data.map((item) => this.toJsonApiResource(item))
            : this.toJsonApiResource(data),
        };
      }),
    );
  }

  private toJsonApiResource(item: any) {
    return {
      type: item.type ?? 'resource', // aquí puedes inferir el tipo según tu entidad
      id: item.id?.toString(),
      attributes: this.pickAttributes(item),
      relationships: this.pickRelationships(item),
      links: {
        self: `/api/${item.type ?? 'resource'}/${item.id}`,
      },
    };
  }

  private pickAttributes(item: any) {
    const { id, type, ...rest } = item;
    return rest;
  }

  private pickRelationships(item: any) {
    // Aquí decides qué campos consideras relaciones
    return undefined;
  }
}
