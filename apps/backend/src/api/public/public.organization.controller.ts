import {Controller, Get, Headers, Query} from "@nestjs/common";
import {DomainSubDomainOrganizationValidator} from "@meetfaq/validators/src/public/domain.subDomain.organization.validator";
import {OrganizationService} from "@meetfaq/database/src/organization/organization.service";
import {ApiExcludeEndpoint, ApiTags} from "@nestjs/swagger";

@ApiTags('Public')
@Controller('/public/organization')
export class PublicOrganizationController {
    constructor(
        private _organizationService: OrganizationService,
    ) {
    }
    @Get('/')
    @ApiExcludeEndpoint()
    async organization(
        @Query() query: DomainSubDomainOrganizationValidator,
        @Headers('serverkey') serverkey: string
    ) {
        if (serverkey !== process.env.BACKEND_TOKEN_PROTECTOR) {
            return 401;
        }
        return this._organizationService.getOrganizationByDomainSubDomain(query);
    }
}
