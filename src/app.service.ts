import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    // console.log(v8.getHeapStatistics().heap_size_limit / (1024 * 1024));

    return 'Hello World!';
  }
}
