import { Injectable } from '@nestjs/common';
import { Author } from '../models/author.model';

type AuthorSubType = Omit<Author, 'posts'>;

@Injectable()
export class AuthorsService {
  private readonly authors: Array<AuthorSubType> = [
    { id: 1, firstName: 'John', lastName: 'Doe' },
    { id: 2, firstName: 'Jane', lastName: 'Doe' },
    { id: 3, firstName: 'Bob', lastName: 'Smith' },
  ];

  create(author: AuthorSubType): AuthorSubType {
    author.id = this.authors.length + 1;
    this.authors.push(author);
    return author;
  }

  findAll(): AuthorSubType[] {
    return this.authors;
  }

  findOneById(id: number): AuthorSubType | undefined {
    return this.authors.find((author) => author.id === id);
  }
}
