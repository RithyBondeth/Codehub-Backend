import { ConfigService } from '@nestjs/config';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { Comment } from 'src/entities/comment.entity';
import { Article } from 'src/entities/article.entity';
import { User } from 'src/entities/user.entity';
import { Work } from 'src/entities/work.entity';
import { Service } from 'src/entities/service.entity';
import { Vision } from 'src/entities/vision.entity';
import { Technology } from 'src/entities/technology.entity';
import { Message } from 'src/entities/message.entity';
import { Course } from 'src/entities/course.entity';

export const dbConfig = async (configService: ConfigService): Promise<PostgresConnectionOptions> => ({
  type: "postgres",
  url: configService.get<string>("DATABASE_URL"),
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
  port: configService.get<number>("DATABASE_PORT"),
  entities: [User, Comment, Article, Work, Service, Vision, Technology, Message, Course],
  synchronize: configService.get<boolean>('SYNCHRONIZE'),
});
