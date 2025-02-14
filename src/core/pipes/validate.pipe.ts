import { Injectable, ArgumentMetadata, BadRequestException, ValidationPipe, UnprocessableEntityException } from '@nestjs/common';

@Injectable()
export class ValidateInputPipe extends ValidationPipe {
   public async transform(value: any, metadata: ArgumentMetadata) {
      try {
        return await super.transform(value, metadata);
      } catch (e) {
         if (e instanceof BadRequestException) {
            const response = e.getResponse();
            const message = response['message'] || [];
            throw new UnprocessableEntityException(this.handleError(message));
         }
      }
   }

   private handleError(errors: any[]): any[] {
        return errors.map(error => error.constraints || error);
   }
}
