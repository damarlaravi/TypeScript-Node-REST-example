import {Controller, Get} from "routing-controllers";

@Controller('/sample')
export class SampleController {
    @Get('/')
    async get(): Promise<any> {
        console.log('coming here');
        return {data: "Hello App"}
    }
}