export interface IOptions {
    sort?: { [key: string]: 'ASC' | 'DESC' };
    limit?: number;
    skip?: number;
    filters?: { [key: string]: any };
}