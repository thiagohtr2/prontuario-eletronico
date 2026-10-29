import { Fragment } from 'react'
import { Document, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer'
import {
  agruparPorVia,
  clarear,
  CORES_RECEITUARIO,
  dataPorExtenso,
  formatarInstagram,
  formatarSite,
  iniciaisDaProfissional,
  idadeEmAnos,
  itensPreenchidos,
} from './model'
import type { PrescriptionInput } from './model'
import { formatCNPJ, formatPhone } from '../format'

// Tinta de impressão: quase preto, levemente quente, e um cinza do mesmo matiz.
const INK = '#2a1f24'
const MUTED = '#6b5a61'
const HAIRLINE = '#e3d9dc'

function createStyles(k: number, accent: string) {
  const soft = clarear(accent, 0.93)
  const leader = clarear(accent, 0.6)
  const marginX = 52 * k

  return StyleSheet.create({
    page: {
      paddingTop: 34 * k,
      paddingBottom: 92 * k,
      paddingHorizontal: marginX,
      fontFamily: 'Inter',
      fontSize: 9.6 * k,
      color: INK,
      // Sem lineHeight aqui: no react-pdf 4.9 ele impede o desenho dos textos
      // dinâmicos (número da página). Cada texto define o próprio.
    },
    band: { position: 'absolute', top: 0, left: 0, right: 0, height: 5 * k, backgroundColor: accent },
    watermark: {
      position: 'absolute',
      top: '36%',
      left: 0,
      right: 0,
      textAlign: 'center',
      fontFamily: 'Cormorant',
      fontWeight: 600,
      fontSize: 240 * k,
      color: accent,
      opacity: 0.035,
    },
    watermarkImage: {
      position: 'absolute',
      top: '30%',
      left: '25%',
      width: '50%',
      height: 220 * k,
      objectFit: 'contain',
      opacity: 0.05,
    },

    header: { paddingBottom: 14 * k, marginBottom: 18 * k, borderBottomWidth: 0.8, borderBottomColor: accent },
    headerRow: { flexDirection: 'row', alignItems: 'center' },
    logo: { width: 56 * k, height: 56 * k, objectFit: 'contain', marginRight: 14 * k },
    monogram: {
      width: 52 * k,
      height: 52 * k,
      borderRadius: 26 * k,
      borderWidth: 0.9,
      borderColor: accent,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 14 * k,
    },
    monogramText: { fontFamily: 'Cormorant', fontWeight: 600, fontSize: 21 * k, color: accent, lineHeight: 1 },
    identity: { flex: 1 },
    name: { fontFamily: 'Cormorant', fontWeight: 600, fontSize: 23 * k, lineHeight: 1.1, color: INK },
    subtitle: {
      marginTop: 4 * k,
      fontSize: 7.4 * k,
      fontWeight: 600,
      letterSpacing: 1.3 * k,
      textTransform: 'uppercase',
      color: accent,
    },
    registry: { marginTop: 3 * k, fontSize: 8.4 * k, color: MUTED, lineHeight: 1.4 },
    docMeta: { marginLeft: 16 * k, alignItems: 'flex-end', flexShrink: 0, width: 128 * k },
    docTitle: {
      fontFamily: 'Cormorant',
      fontWeight: 600,
      fontStyle: 'italic',
      fontSize: 17 * k,
      color: accent,
      lineHeight: 1.1,
    },
    docDate: { marginTop: 3 * k, fontSize: 8.2 * k, color: MUTED, textAlign: 'right' },

    patient: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      backgroundColor: soft,
      borderRadius: 6 * k,
      paddingVertical: 10 * k,
      paddingHorizontal: 14 * k,
      marginBottom: 22 * k,
    },
    label: {
      fontSize: 6.8 * k,
      fontWeight: 600,
      letterSpacing: 1.2 * k,
      textTransform: 'uppercase',
      color: MUTED,
    },
    patientName: { marginTop: 2 * k, fontFamily: 'Cormorant', fontWeight: 600, fontSize: 17 * k, lineHeight: 1.15 },
    patientMeta: { marginLeft: 12 * k, fontSize: 8.6 * k, color: MUTED, textAlign: 'right' },

    groupSpacing: { marginTop: 14 * k },
    groupHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 * k },
    groupTitle: {
      fontSize: 7.6 * k,
      fontWeight: 700,
      letterSpacing: 1.4 * k,
      textTransform: 'uppercase',
      color: accent,
    },
    groupRule: { flexGrow: 1, marginLeft: 8 * k, borderBottomWidth: 0.5, borderBottomColor: HAIRLINE },

    item: { flexDirection: 'row', marginBottom: 11 * k },
    number: {
      width: 17 * k,
      height: 17 * k,
      borderRadius: 8.5 * k,
      marginRight: 9 * k,
      marginTop: 0.5 * k,
      backgroundColor: soft,
      alignItems: 'center',
      justifyContent: 'center',
    },
    numberText: { fontSize: 7.8 * k, fontWeight: 700, color: accent, lineHeight: 1 },
    itemBody: { flex: 1 },
    itemLine: { flexDirection: 'row', alignItems: 'flex-end' },
    medication: { flexShrink: 1, fontSize: 10.4 * k, fontWeight: 600, lineHeight: 1.3 },
    leader: {
      flexGrow: 1,
      minWidth: 16 * k,
      marginHorizontal: 6 * k,
      marginBottom: 3.2 * k,
      borderBottomWidth: 0.9,
      borderBottomStyle: 'dotted',
      borderBottomColor: leader,
    },
    quantity: { flexShrink: 0, maxWidth: 140 * k, fontSize: 9.4 * k, fontWeight: 500, textAlign: 'right' },
    dosage: { marginTop: 2 * k, fontSize: 9.4 * k, color: MUTED, lineHeight: 1.45 },

    notes: { marginTop: 8 * k, paddingTop: 12 * k, borderTopWidth: 0.5, borderTopColor: HAIRLINE },
    notesText: { marginTop: 5 * k, fontSize: 9.4 * k, lineHeight: 1.55 },

    signatureWrap: { marginTop: 'auto', paddingTop: 34 * k, alignItems: 'flex-end' },
    signature: { width: 220 * k, alignItems: 'center' },
    signatureLine: { width: '100%', borderTopWidth: 0.7, borderTopColor: INK, marginBottom: 5 * k },
    signatureName: { fontSize: 9 * k, fontWeight: 600, textAlign: 'center' },
    signatureMeta: { fontSize: 7.8 * k, color: MUTED, textAlign: 'center' },

    footer: {
      position: 'absolute',
      left: marginX,
      right: marginX,
      bottom: 22 * k,
      paddingTop: 9 * k,
      borderTopWidth: 0.8,
      borderTopColor: accent,
    },
    footerRow: { flexDirection: 'row', justifyContent: 'space-between' },
    footerLeft: { flex: 1, paddingRight: 14 * k },
    footerRight: { flexShrink: 0, width: 190 * k, alignItems: 'flex-end' },
    footerStrong: { fontSize: 7.8 * k, fontWeight: 600, color: INK },
    footerText: { fontSize: 7.3 * k, color: MUTED, lineHeight: 1.45 },
    footerTextRight: { fontSize: 7.3 * k, color: MUTED, lineHeight: 1.45, textAlign: 'right' },
    footerNote: {
      marginTop: 6 * k,
      fontFamily: 'Cormorant',
      fontStyle: 'italic',
      fontWeight: 500,
      fontSize: 10 * k,
      color: accent,
      textAlign: 'center',
    },
    pageNumber: {
      position: 'absolute',
      left: marginX,
      right: marginX,
      bottom: 9 * k,
      fontSize: 6.8 * k,
      color: MUTED,
      textAlign: 'center',
    },
    sample: {
      position: 'absolute',
      top: 12 * k,
      right: marginX,
      fontSize: 6.4 * k,
      fontWeight: 700,
      letterSpacing: 1.2 * k,
      color: accent,
    },
  })
}

const join = (...parts: Array<string | null | undefined>) => parts.filter((part) => part && part.trim()).join('  ·  ')

/**
 * Receituário em PDF. Cabeçalho e rodapé se repetem em todas as páginas;
 * medicamentos nunca são partidos entre páginas.
 */
export function PrescriptionDocument({ input }: { input: PrescriptionInput }) {
  const { doctor, clinic, patient } = input
  const a5 = doctor.papel_receituario === 'A5'
  const k = a5 ? 0.8 : 1
  const accent = CORES_RECEITUARIO[doctor.cor_receituario]?.hex ?? CORES_RECEITUARIO.vinho.hex
  const s = createStyles(k, accent)

  const nome = doctor.nome.trim() || 'Seu nome'
  const subtitulo = doctor.titulo_profissional?.trim() || doctor.especialidade?.trim()
  const registro = join(doctor.crm.trim() && `CRM ${doctor.crm.trim()}`, doctor.rqe?.trim() && `RQE ${doctor.rqe.trim()}`)
  const data = dataPorExtenso(input.dataHora)
  const cidade = clinic?.cidade?.trim()
  const idade = idadeEmAnos(patient.data_nascimento)
  const grupos = agruparPorVia(itensPreenchidos(input.itens))
  const orientacoes = input.orientacoes.trim()

  // Até duas linhas de contato, para o rodapé ter altura previsível.
  const contatos = [
    join(doctor.telefone ? formatPhone(doctor.telefone) : '', doctor.email_contato),
    join(formatarInstagram(doctor.instagram), formatarSite(doctor.site)),
  ].filter(Boolean)

  // Endereço numa linha e telefone/CNPJ na outra, para nenhum separador
  // começar linha quando o endereço é longo.
  const local = clinic
    ? {
        titulo: clinic.nome,
        linhas: [
          join(clinic.endereco, cidade),
          join(clinic.telefone ? formatPhone(clinic.telefone) : '', clinic.cnpj && `CNPJ ${formatCNPJ(clinic.cnpj)}`),
        ],
      }
    : doctor.endereco_profissional?.trim()
      ? { titulo: 'Consultório', linhas: [doctor.endereco_profissional.trim()] }
      : null

  return (
    <Document
      title={`Receita — ${patient.nome}`}
      author={nome}
      subject={`Receita de ${patient.nome}${data ? `, ${data}` : ''}`}
      creator="Singulare"
      producer="Singulare"
      language="pt-BR"
    >
      <Page size={a5 ? 'A5' : 'A4'} style={s.page}>
        <View fixed style={s.band} />
        {doctor.logo_url ? (
          <Image fixed src={doctor.logo_url} style={s.watermarkImage} />
        ) : (
          <Text fixed style={s.watermark}>
            {iniciaisDaProfissional(nome)}
          </Text>
        )}
        {input.exemplo && (
          <Text fixed style={s.sample}>
            MODELO · DADOS FICTÍCIOS
          </Text>
        )}

        <View fixed style={s.header}>
          <View style={s.headerRow}>
            {doctor.logo_url ? (
              <Image src={doctor.logo_url} style={s.logo} />
            ) : (
              <View style={s.monogram}>
                <Text style={s.monogramText}>{iniciaisDaProfissional(nome)}</Text>
              </View>
            )}
            <View style={s.identity}>
              <Text style={s.name}>{nome}</Text>
              {subtitulo ? <Text style={s.subtitle}>{subtitulo}</Text> : null}
              {registro ? <Text style={s.registry}>{registro}</Text> : null}
            </View>
            <View style={s.docMeta}>
              <Text style={s.docTitle}>Receituário</Text>
              <Text style={s.docDate}>{cidade ? `${cidade}, ${data}` : data}</Text>
            </View>
          </View>
        </View>

        <View style={s.patient} wrap={false}>
          <View style={{ flexShrink: 1 }}>
            <Text style={s.label}>Paciente</Text>
            <Text style={s.patientName}>{patient.nome}</Text>
          </View>
          {idade !== null && <Text style={s.patientMeta}>{idade} anos</Text>}
        </View>

        {/* Cabeçalhos de grupo e itens ficam no mesmo nível, para a quebra de
            página acontecer item a item, nunca no meio de um medicamento. */}
        {grupos.map((grupo, index) => (
          <Fragment key={grupo.via}>
            <View style={[s.groupHeader, index > 0 ? s.groupSpacing : {}]} wrap={false} minPresenceAhead={48 * k}>
              <Text style={s.groupTitle}>{grupo.via}</Text>
              <View style={s.groupRule} />
            </View>
            {grupo.itens.map(({ numero, item }) => (
              <View key={item.id} style={s.item} wrap={false}>
                <View style={s.number}>
                  <Text style={s.numberText}>{numero}</Text>
                </View>
                <View style={s.itemBody}>
                  <View style={s.itemLine}>
                    <Text style={s.medication}>{item.medicamento || 'Medicamento'}</Text>
                    {item.quantidade ? (
                      <>
                        <View style={s.leader} />
                        <Text style={s.quantity}>{item.quantidade}</Text>
                      </>
                    ) : null}
                  </View>
                  {item.posologia ? <Text style={s.dosage}>{item.posologia}</Text> : null}
                </View>
              </View>
            ))}
          </Fragment>
        ))}

        {orientacoes ? (
          <View style={grupos.length > 0 ? s.notes : undefined}>
            <Text style={s.groupTitle}>{grupos.length > 0 ? 'Orientações' : 'Prescrição'}</Text>
            <Text style={s.notesText}>{orientacoes}</Text>
          </View>
        ) : null}

        <View style={s.signatureWrap} wrap={false}>
          <View style={s.signature}>
            <View style={s.signatureLine} />
            <Text style={s.signatureName}>{nome}</Text>
            {registro ? <Text style={s.signatureMeta}>{registro}</Text> : null}
          </View>
        </View>

        <View fixed style={s.footer}>
          <View style={s.footerRow}>
            <View style={s.footerLeft}>
              {local ? (
                <>
                  <Text style={s.footerStrong}>{local.titulo}</Text>
                  {local.linhas.filter(Boolean).map((linha) => (
                    <Text key={linha} style={s.footerText}>
                      {linha}
                    </Text>
                  ))}
                </>
              ) : null}
            </View>
            {contatos.length > 0 && (
              <View style={s.footerRight}>
                {contatos.map((contato) => (
                  <Text key={contato} style={s.footerTextRight}>
                    {contato}
                  </Text>
                ))}
              </View>
            )}
          </View>
          {doctor.rodape_receituario?.trim() ? <Text style={s.footerNote}>{doctor.rodape_receituario.trim()}</Text> : null}

        </View>

        {/* Fora do rodapé: um texto dinâmico dentro de um bloco fixo faz o
            react-pdf descartar o bloco inteiro em documentos com 2+ páginas. */}
        <Text
          fixed
          style={s.pageNumber}
          render={({ pageNumber, totalPages }) =>
            totalPages > 1 ? `${patient.nome}  ·  Página ${pageNumber} de ${totalPages}` : ''
          }
        />
      </Page>
    </Document>
  )
}
