import type { CoreTool } from "ai"

export const sofiaTools: Record<string, CoreTool> = {
  search_knowledge_base: {
    description:
      "Busca na base de conhecimento por informações sobre produtos, cursos, mentorias, FAQs. Use palavras-chave relacionadas à dúvida do cliente.",
    parameters: {
      type: "object",
      properties: {
        keywords: {
          type: "array",
          items: { type: "string" },
          description: "Palavras-chave para buscar (ex: ['couply', 'acesso'], ['reembolso', 'hotmart'])",
        },
        category: {
          type: "string",
          enum: ["acesso", "compra", "tecnico", "produtos", "geral"],
          description: "Categoria da busca",
        },
      },
      required: ["keywords"],
    },
  },

  check_customer_exists: {
    description:
      "Verifica se o cliente existe no sistema e retorna informações básicas (histórico de compras, status de acesso).",
    parameters: {
      type: "object",
      properties: {
        email: {
          type: "string",
          description: "Email do cliente",
        },
      },
      required: ["email"],
    },
  },

  verify_purchase: {
    description: "Verifica se o cliente realizou uma compra específica na plataforma de pagamento (Hotmart/Pagtrust).",
    parameters: {
      type: "object",
      properties: {
        email: {
          type: "string",
          description: "Email do cliente",
        },
        product: {
          type: "string",
          description: "Nome ou código do produto (opcional)",
        },
      },
      required: ["email"],
    },
  },

  check_member_access: {
    description: "Verifica se o cliente tem acesso na área de membros e quais produtos estão liberados.",
    parameters: {
      type: "object",
      properties: {
        email: {
          type: "string",
          description: "Email do cliente",
        },
      },
      required: ["email"],
    },
  },

  create_ticket: {
    description:
      "Cria um ticket de suporte com todas as informações coletadas. Use quando resolver o problema ou quando for escalar.",
    parameters: {
      type: "object",
      properties: {
        customer_name: {
          type: "string",
          description: "Nome completo do cliente",
        },
        customer_email: {
          type: "string",
          description: "Email do cliente",
        },
        customer_cpf: {
          type: "string",
          description: "CPF do cliente",
        },
        subject: {
          type: "string",
          description: "Resumo curto do problema (ex: 'Problema de acesso ao Couply')",
        },
        category: {
          type: "string",
          enum: ["acesso", "compra", "tecnico", "financeiro", "outros"],
          description: "Categoria do problema",
        },
        priority: {
          type: "string",
          enum: ["baixa", "media", "alta", "urgente"],
          description: "Prioridade do atendimento",
        },
        resolved: {
          type: "boolean",
          description: "Se o problema foi resolvido pela IA (true) ou precisa de humano (false)",
        },
        resolution_summary: {
          type: "string",
          description: "Resumo da solução fornecida ou motivo do escalonamento",
        },
      },
      required: [
        "customer_name",
        "customer_email",
        "subject",
        "category",
        "priority",
        "resolved",
        "resolution_summary",
      ],
    },
  },

  escalate_to_human: {
    description: "Escalona o atendimento para um humano. Use quando não conseguir resolver ou em situações críticas.",
    parameters: {
      type: "object",
      properties: {
        reason: {
          type: "string",
          description: "Motivo do escalonamento (ex: 'Problema técnico complexo', 'Cliente insatisfeito')",
        },
        urgency: {
          type: "string",
          enum: ["normal", "alta", "urgente"],
          description: "Nível de urgência do escalonamento",
        },
      },
      required: ["reason", "urgency"],
    },
  },

  extract_customer_data: {
    description:
      "Extrai e valida dados do cliente (Nome, Email, CPF) da mensagem. Use quando o cliente enviar seus dados.",
    parameters: {
      type: "object",
      properties: {
        message: {
          type: "string",
          description: "Mensagem do cliente contendo os dados",
        },
      },
      required: ["message"],
    },
  },
}
