import { type ReactNode, useState } from 'react'
import {
	Document,
	Image,
	Page,
	PDFDownloadLink,
	StyleSheet,
	Text,
	View,
} from '@react-pdf/renderer'
import { z } from 'zod'
import logo from '../assets/logo.png'

type CVDocumentProps = {
	fullName: string
	phone: string
	email: string
	country: string
	github: string
	summary: string
	experience: string
}

type FormValues = {
	fullName: string
	phone: string
	email: string
	country: string
	github: string
	summary: string
	experience: string
}

type FieldErrors = Partial<Record<keyof FormValues, string>>

const formSchema = z.object({
	fullName: z
		.string()
		.trim()
		.min(1, 'El nombre es obligatorio.'),
	phone: z
		.string()
		.trim()
		.min(1, 'El telefono es obligatorio.')
		.regex(/^\d+$/, 'El telefono debe contener solo numeros.'),
	email: z
		.string()
		.trim()
		.min(1, 'El email es obligatorio.')
		.email('El email no tiene un formato valido.'),
	country: z
		.string()
		.trim()
		.min(1, 'El pais es obligatorio.'),
	github: z
		.string()
		.trim()
		.min(1, 'El link de GitHub es obligatorio.')
		.url('El link de GitHub no tiene un formato valido.')
		.refine(
			(value) => value.toLowerCase().includes('github.com'),
			'El link debe ser de GitHub.'
		),
	summary: z
		.string()
		.trim()
		.min(1, 'El resumen es obligatorio.'),
	experience: z
		.string()
		.trim()
		.min(1, 'La experiencia laboral es obligatoria.'),
})

const pdfStyles = StyleSheet.create({
	page: {
		padding: 36,
		fontSize: 11,
		fontFamily: 'Helvetica',
		color: '#0f172a',
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-end',
		paddingBottom: 12,
		borderBottomWidth: 1,
		borderBottomColor: '#e2e8f0',
		marginBottom: 16,
	},
	name: {
		fontSize: 24,
		fontWeight: 'bold',
		letterSpacing: 0.3,
	},
	subtitle: {
		fontSize: 12,
		color: '#475569',
		marginTop: 4,
	},
	badge: {
		fontSize: 9,
		color: '#ffffff',
		backgroundColor: '#0f172a',
		paddingTop: 4,
		paddingBottom: 4,
		paddingLeft: 8,
		paddingRight: 8,
		borderRadius: 12,
	},
	section: {
		marginTop: 12,
	},
	sectionTitle: {
		fontSize: 11,
		letterSpacing: 1,
		color: '#334155',
		marginBottom: 6,
	},
	bodyText: {
		lineHeight: 1.4,
	},
	contactRow: {
		flexDirection: 'row',
		marginBottom: 4,
	},
	contactLabel: {
		width: 80,
		color: '#64748b',
	},
	contactValue: {
		flex: 1,
	},
	divider: {
		height: 1,
		backgroundColor: '#e2e8f0',
		marginTop: 12,
	},
	logo: {
		width: 400,
		height: 100,
		objectFit: 'contain',
		marginRight: 12,
	},
	certificateTitle: {
		fontSize: 20,
		fontWeight: 'bold',
	},
})

type FieldErrorProps = {
	message?: string
	id?: string
}

function FieldError({ message, id }: FieldErrorProps) {
	if (!message) {
		return null
	}

	return (
		<p id={id} style={{ margin: 0, fontSize: 12, color: '#dc2626' }}>
			{message}
		</p>
	)
}

type FormFieldProps = {
	label: string
	error?: string
	errorId?: string
	children: ReactNode
}

function FormField({ label, error, errorId, children }: FormFieldProps) {
	return (
		<label style={{ display: 'grid', gap: 6 }}>
			<span>{label}</span>
			{children}
			<FieldError message={error} id={errorId} />
		</label>
	)
}

function getFieldErrors(values: FormValues) {
	const result = formSchema.safeParse(values)
	const errors: FieldErrors = {}

	if (!result.success) {
		for (const issue of result.error.issues) {
			const fieldName = issue.path[0] as keyof FormValues
			if (!errors[fieldName]) {
				errors[fieldName] = issue.message
			}
		}
	}

	return { result, errors }
}

function CVDocument({
	fullName,
	phone,
	email,
	country,
	github,
	summary,
	experience,
}: CVDocumentProps) {
	return (
		<Document>
			<Page size="A4" style={pdfStyles.page}>
				<View style={pdfStyles.header}>
					<View>
						<Text style={pdfStyles.name}>{fullName}</Text>
						<Text style={pdfStyles.subtitle}>Perfil profesional</Text>
					</View>
					<Text style={pdfStyles.badge}>CV</Text>
				</View>

				<View style={pdfStyles.section}>
					<Text style={pdfStyles.sectionTitle}>Perfil</Text>
					<Text style={pdfStyles.bodyText}>
						Profesional orientado a resultados, con enfoque en calidad, orden y
						comunicacion clara. Capaz de colaborar en equipos y entregar trabajos
						con atencion al detalle y enfoque practico.
					</Text>
				</View>

				<View style={pdfStyles.section}>
					<Text style={pdfStyles.sectionTitle}>Contacto</Text>
					<View style={pdfStyles.contactRow}>
						<Text style={pdfStyles.contactLabel}>Telefono</Text>
						<Text style={pdfStyles.contactValue}>{phone}</Text>
					</View>
					<View style={pdfStyles.contactRow}>
						<Text style={pdfStyles.contactLabel}>Email</Text>
						<Text style={pdfStyles.contactValue}>{email}</Text>
					</View>
					<View style={pdfStyles.contactRow}>
						<Text style={pdfStyles.contactLabel}>Pais</Text>
						<Text style={pdfStyles.contactValue}>{country}</Text>
					</View>
					<View style={pdfStyles.contactRow}>
						<Text style={pdfStyles.contactLabel}>GitHub</Text>
						<Text style={pdfStyles.contactValue}>{github}</Text>
					</View>
				</View>

				<View style={pdfStyles.divider} />

				<View style={pdfStyles.section}>
					<Text style={pdfStyles.sectionTitle}>Resumen</Text>
					<Text style={pdfStyles.bodyText}>{summary}</Text>
				</View>

				<View style={pdfStyles.section}>
					<Text style={pdfStyles.sectionTitle}>Experiencia laboral</Text>
					<Text style={pdfStyles.bodyText}>{experience}</Text>
				</View>
			</Page>
		</Document>
	)
}

type CertificateDocumentProps = {
	fullName: string
	phone: string
	email: string
	country: string
}

function CertificateDocument({
	fullName,
	phone,
	email,
	country,
}: CertificateDocumentProps) {
	return (
		<Document>
			<Page size="A4" style={pdfStyles.page}>
				<View style={pdfStyles.header}>
					<View style={{ flexDirection: 'row', alignItems: 'center' }}>
						<Image src={logo} style={pdfStyles.logo} />
						<View>
							<Text style={pdfStyles.certificateTitle}>
								Constancia laboral
							</Text>
						</View>
					</View>
					<Text style={pdfStyles.badge}>RRHH</Text>
				</View>

				<View style={pdfStyles.section}>
					<Text style={pdfStyles.bodyText}>
						Por medio de la presente se hace constar que {fullName} ({email},
						{phone}), residente en {country}, labora actualmente en la empresa
						Game Beets, desarrolladora de videojuegos.
					</Text>
				</View>
			</Page>
		</Document>
	)
}

export default function Formulario() {
	const [fullName, setFullName] = useState('')
	const [phone, setPhone] = useState('')
	const [email, setEmail] = useState('')
	const [country, setCountry] = useState('')
	const [github, setGithub] = useState('')
	const [summary, setSummary] = useState('')
	const [experience, setExperience] = useState('')
	const [touched, setTouched] = useState({
		fullName: false,
		phone: false,
		email: false,
		country: false,
		github: false,
		summary: false,
		experience: false,
	})

	const values = { fullName, phone, email, country, github, summary, experience }
	const { result, errors } = getFieldErrors(values)
	const isFormValid = result.success
	const normalizedValues = result.success
		? result.data
		: {
				fullName: fullName.trim(),
				phone: phone.trim(),
				email: email.trim(),
				country: country.trim(),
				github: github.trim(),
				summary: summary.trim(),
				experience: experience.trim(),
			}

	const safeName = normalizedValues.fullName
		.replace(/\s+/g, '-')
		.replace(/[^a-zA-Z0-9-_]/g, '')
		.toLowerCase()
	const fileName = `CV-${safeName.length ? safeName : 'cv'}.pdf`
	const certificateFileName = `Constancia-${
		safeName.length ? safeName : 'laboral'
	}.pdf`

	const nameError = touched.fullName ? errors.fullName : undefined
	const phoneError = touched.phone ? errors.phone : undefined
	const emailError = touched.email ? errors.email : undefined
	const countryError = touched.country ? errors.country : undefined
	const githubError = touched.github ? errors.github : undefined
	const summaryError = touched.summary ? errors.summary : undefined
	const experienceError = touched.experience ? errors.experience : undefined

	const nameErrorId = nameError ? 'full-name-error' : undefined
	const phoneErrorId = phoneError ? 'phone-error' : undefined
	const emailErrorId = emailError ? 'email-error' : undefined
	const countryErrorId = countryError ? 'country-error' : undefined
	const githubErrorId = githubError ? 'github-error' : undefined
	const summaryErrorId = summaryError ? 'summary-error' : undefined
	const experienceErrorId = experienceError ? 'experience-error' : undefined

	return (
		<section>
			<form
				onSubmit={(event) => event.preventDefault()}
				style={{ display: 'grid', gap: 12, maxWidth: 420 }}
			>
				<FormField label="Nombre completo" error={nameError} errorId={nameErrorId}>
					<input
						id="full-name"
						type="text"
						value={fullName}
						onChange={(event) => setFullName(event.target.value)}
						onBlur={() =>
							setTouched((prev) => ({ ...prev, fullName: true }))
						}
						placeholder="Ej: Juan Perez"
						autoComplete="name"
						aria-invalid={Boolean(nameError)}
						aria-describedby={nameErrorId}
					/>
				</FormField>
				<FormField label="Telefono" error={phoneError} errorId={phoneErrorId}>
					<input
						id="phone"
						type="tel"
						value={phone}
						onChange={(event) => setPhone(event.target.value)}
						onBlur={() => setTouched((prev) => ({ ...prev, phone: true }))}
						placeholder="Ej: 555123456"
						autoComplete="tel"
						inputMode="numeric"
						aria-invalid={Boolean(phoneError)}
						aria-describedby={phoneErrorId}
					/>
				</FormField>
				<FormField label="Email" error={emailError} errorId={emailErrorId}>
					<input
						id="email"
						type="email"
						value={email}
						onChange={(event) => setEmail(event.target.value)}
						onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
						placeholder="Ej: nombre@correo.com"
						autoComplete="email"
						aria-invalid={Boolean(emailError)}
						aria-describedby={emailErrorId}
					/>
				</FormField>
				<FormField label="Pais" error={countryError} errorId={countryErrorId}>
					<input
						id="country"
						type="text"
						value={country}
						onChange={(event) => setCountry(event.target.value)}
						onBlur={() => setTouched((prev) => ({ ...prev, country: true }))}
						placeholder="Ej: Guatemala"
						autoComplete="country-name"
						aria-invalid={Boolean(countryError)}
						aria-describedby={countryErrorId}
					/>
				</FormField>
				<FormField
					label="Link de GitHub"
					error={githubError}
					errorId={githubErrorId}
				>
					<input
						id="github"
						type="url"
						value={github}
						onChange={(event) => setGithub(event.target.value)}
						onBlur={() => setTouched((prev) => ({ ...prev, github: true }))}
						placeholder="Ej: https://github.com/usuario"
						autoComplete="url"
						aria-invalid={Boolean(githubError)}
						aria-describedby={githubErrorId}
					/>
				</FormField>
				<FormField
					label="Resumen"
					error={summaryError}
					errorId={summaryErrorId}
				>
					<textarea
						id="summary"
						value={summary}
						onChange={(event) => setSummary(event.target.value)}
						onBlur={() => setTouched((prev) => ({ ...prev, summary: true }))}
						placeholder="Ej: Desarrollador frontend con 3 anos de experiencia..."
						rows={4}
						aria-invalid={Boolean(summaryError)}
						aria-describedby={summaryErrorId}
					/>
				</FormField>
				<FormField
					label="Experiencia laboral"
					error={experienceError}
					errorId={experienceErrorId}
				>
					<textarea
						id="experience"
						value={experience}
						onChange={(event) => setExperience(event.target.value)}
						onBlur={() =>
							setTouched((prev) => ({ ...prev, experience: true }))
						}
						placeholder="Ej: 2023-2025 Frontend Developer en ACME..."
						rows={4}
						aria-invalid={Boolean(experienceError)}
						aria-describedby={experienceErrorId}
					/>
				</FormField>
			</form>

			<div style={{ marginTop: 16, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
				{isFormValid ? (
					<PDFDownloadLink
						document={
							<CVDocument
								fullName={normalizedValues.fullName}
								phone={normalizedValues.phone}
								email={normalizedValues.email}
								country={normalizedValues.country}
								github={normalizedValues.github}
								summary={normalizedValues.summary}
								experience={normalizedValues.experience}
							/>
						}
						fileName={fileName}
					>
						{({ loading }) => (
							<button type="button" disabled={loading}>
								{loading ? 'Generando PDF...' : 'Descargar CV en PDF'}
							</button>
						)}
					</PDFDownloadLink>
				) : (
					<button type="button" disabled>
						Generar PDF
					</button>
				)}
				{isFormValid ? (
					<PDFDownloadLink
						document={
							<CertificateDocument
								fullName={normalizedValues.fullName}
								phone={normalizedValues.phone}
								email={normalizedValues.email}
								country={normalizedValues.country}
							/>
						}
						fileName={certificateFileName}
					>
						{({ loading }) => (
							<button type="button" disabled={loading}>
								{loading
									? 'Generando constancia...'
									: 'Descargar constancia laboral'}
							</button>
						)}
					</PDFDownloadLink>
				) : (
					<button type="button" disabled>
						Generar constancia
					</button>
				)}
			</div>
		</section>
	)
}
