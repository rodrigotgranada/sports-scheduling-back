export class User {
  constructor(
    public id: string,
    public firstName: string,
    public lastName: string,
    public cpf: string,
    public phone: string,
    public email: string,
    public password: string,
    public isActive: 'pending' | 'active' | 'blocked',
    public role: 'user' | 'admin' | 'owner',
    public createdAt: Date,
    public updatedAt: Date,
    public createdBy: string,
    public updatedBy: string,
    public foto: string // Adicionando o campo foto
    
  ) {}
}
