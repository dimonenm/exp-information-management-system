import {
	Controller,
	Get,
	Body,
	UsePipes,
	HttpCode,
	ValidationPipe,
	Put,
	Res
} from '@nestjs/common'
import { Response } from 'express'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/auth/decorators/user.decorator'
import { UserService } from './user.service'
import { UserDto } from './dto/user.dto'
import { IsAdmin } from './decorators/isAdmin.decorator'

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get('getAll')
	@Auth()
	async getAll(@CurrentUser('id') id: string, @Res() res: Response) {
		const users = await this.userService.findAll(id)
		if (users.length > 0) {
			res.send(users)
		} else {
			console.log('not admin')
			res.send({ message: 'Only admin can see users list' })
		}
	}

	@Get('profile')
	@Auth()
	async getProfile(@CurrentUser('id') id: string) {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password, ...user } = await this.userService.getById(id)
		return user
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Auth()
	@Put('update')
	async updateUser(@CurrentUser('id') id: string, @Body() userDto: UserDto) {
		return await this.userService.update(id, userDto)
	}

	@Get('testAdmin')
	@Auth()
	async getAdmin(@CurrentUser('id') id: string, @IsAdmin('role') isAdmin: string) {
		if (isAdmin === 'admin') {
			const { password, ...user } = await this.userService.getById(id)			
			return user
		} else {
			return 'you is not an admin'
		}
	}
}
