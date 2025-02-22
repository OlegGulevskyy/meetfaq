import {Injectable} from "@nestjs/common";
import {IntegrationsRepository} from "@meetfaq/database/src/integrations/integrations.repository";
import {Discord, Slack} from "@meetfaq/validators/src/integrations/create.integration.validator";
import {IntegrationType} from '@prisma/client';

@Injectable()
export class IntegrationsService {
  constructor(
    private readonly _integrationsRepository: IntegrationsRepository
  ) {}

  findByGuildAndId(guildId: string, internalId: string) {
    return this._integrationsRepository.findByGuildAndId(guildId, internalId);
  }
  totalIntegrationsByOrganizationId(organizationId: string) {
    return this._integrationsRepository.totalIntegrationsByOrganizationId(organizationId);
  }

  getIntegrationByOrganizationId(organizationId: string) {
    return this._integrationsRepository.getIntegrationByOrganizationId(organizationId);
  }

  deleteIntegration(organizationId: string, id: string) {
    return this._integrationsRepository.deleteIntegration(organizationId, id);
  }

  async createDiscordIntegration(orgId: string, discord: Discord) {
    const data = await (await fetch('https://discord.com/api/v10/oauth2/token', {
      method: 'POST',
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        'code': discord.code,
        'redirect_uri': `${process.env['FRONTEND_URL']}/api/integrations/discord`,
        client_id: process.env['DISCORD_CLIENT']!,
        client_secret: process.env['DISCORD_SECRET']!,
        'scope': 'identify email bot guilds'
      })
    })).json();


    const info = await (await fetch(`https://discord.com/api/v10/users/@me/guilds`, {
      method: 'GET',
      headers: {
        'User-Agent': 'DiscordBot',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${data.access_token}`
      }
    })).json();

    const findGuild = info.find((guild: {id: string, name: string}) => guild.id === discord.guild_id);

    const myUser = await (await fetch(`https://discord.com/api/v10/users/@me`, {
      method: 'GET',
      headers: {
        'User-Agent': 'DiscordBot',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${data.access_token}`
      }
    })).json();

    return this._integrationsRepository.createIntegration({
      internalId: discord.guild_id,
      type: IntegrationType.DISCORD,
      organizationId: orgId,
      token: data.access_token,
      notes: findGuild.name,
    }, myUser.id);
  }

  createSlackIntegration(slack: Slack) {
    return slack;
  }

  addUserToIntegration(organizationId: string, guild: string, internalId: string) {
    return this._integrationsRepository.addUserToIntegration(organizationId, guild, internalId);
  }
}
