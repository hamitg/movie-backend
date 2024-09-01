import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

class WatchHistoryItem {
  @Expose()
  @ApiProperty({ example: 1, description: 'The ID of the watch history item' })
  id: number;

  @Expose()
  @ApiProperty({
    example: '2023-06-15',
    description: 'The date the movie was watched',
  })
  watchDate: string;

  @Expose()
  @ApiProperty({ example: 'Inception', description: 'The name of the movie' })
  movieName: string;

  @Expose()
  @ApiProperty({ example: 1, description: 'The ID of the movie' })
  movieId: number;

  constructor(partial: Partial<WatchHistoryItem>) {
    Object.assign(this, partial);
  }
}

export class WatchHistoryResponseDto {
  @Expose()
  @ApiProperty({
    type: [WatchHistoryItem],
    description: 'Array of watch history items',
  })
  @Type(() => WatchHistoryItem)
  history: WatchHistoryItem[];

  constructor(history: Partial<WatchHistoryItem>[]) {
    this.history = history.map((item) => new WatchHistoryItem(item));
  }
}
