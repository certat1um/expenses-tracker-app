import {
  Body,
  Delete,
  Get,
  JsonController,
  Param,
  Post,
  Put,
  UseBefore,
} from 'routing-controllers';
import { Inject, Service } from 'typedi';
import { RecordService } from '../services/record';
import { IRecord } from '../interfaces/record';
import { CreatePolicy } from '../policies/create.policy';
import { UpdateByIdPolicy } from '../policies/updateById.policy';
import { DeleteByIdPolicy } from '../policies/deleteById.policy';

@Service()
@JsonController('/records')
export class RecordController {
  @Inject() private recordService: RecordService;

  @Get('/get-by-user/:id')
  public async findByUser(@Param('id') userId: string): Promise<IRecord[]> {
    return this.recordService.findByUser(userId);
  }

  @Post('/create')
  @UseBefore(CreatePolicy)
  public async create(@Body() data: IRecord): Promise<IRecord> {
    return this.recordService.create(data);
  }

  @Put('/update/:id')
  @UseBefore(UpdateByIdPolicy)
  public async updateById(
    @Param('id') id: string,
    @Body() data: Partial<IRecord>,
  ): Promise<IRecord> {
    return this.recordService.updateById(id, data);
  }

  @Delete('/delete/:id')
  @UseBefore(DeleteByIdPolicy)
  public async deleteById(@Param('id') id: string): Promise<IRecord> {
    return this.recordService.deleteById(id);
  }
}
