"use client"

import { Card } from "@/components/ui/card"
import { Info } from "lucide-react"

export function ProductPageSettings() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        As configurações de página de produto agora são individuais para cada produto.
      </p>

      <Card className="p-6 border-border/50 bg-card space-y-4">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-primary mt-0.5" />
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">Configurações por Produto</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Agora você pode personalizar cada produto individualmente! Ao editar um produto na aba "Produtos", você
              encontrará as seguintes opções na aba "Página":
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-2">
              <li>
                <strong className="text-foreground">Avaliações:</strong> Ative/desative avaliações, defina a nota e o
                número de avaliações
              </li>
              <li>
                <strong className="text-foreground">Produtos Relacionados:</strong> Selecione manualmente quais produtos
                aparecerão como relacionados
              </li>
            </ul>
            <p className="text-sm text-primary font-medium mt-4">
              💡 Dica: Vá para a aba "Produtos" e clique em "Editar" em qualquer produto para acessar essas
              configurações!
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6 border-border/50 bg-card space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Recursos Disponíveis</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <h4 className="font-medium text-foreground">⭐ Avaliações Personalizadas</h4>
            <p className="text-sm text-muted-foreground">
              Configure avaliações únicas para cada produto com estrelas e número de reviews customizados.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-foreground">🔗 Produtos Relacionados</h4>
            <p className="text-sm text-muted-foreground">
              Escolha exatamente quais produtos aparecerão como relacionados em cada página de produto.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-foreground">🎨 Selos de Destaque</h4>
            <p className="text-sm text-muted-foreground">
              Use os selos personalizados criados na aba "Selos" para destacar produtos especiais.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-foreground">📸 Múltiplas Imagens</h4>
            <p className="text-sm text-muted-foreground">
              Adicione várias imagens para cada produto com galeria de visualização.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
