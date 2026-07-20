# Commit Convention

Menggunakan format ringkas ala [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <deskripsi singkat, present tense>
```

## Type yang dipakai

| Type | Kapan dipakai |
|---|---|
| `feat` | Menambah fitur/behavior baru |
| `fix` | Memperbaiki bug |
| `docs` | Perubahan dokumentasi saja |
| `style` | Format/lint, tidak mengubah logic |
| `refactor` | Ubah struktur kode, behavior tetap sama |
| `test` | Menambah/memperbaiki test |
| `chore` | Setup, dependency, config, tooling |

## Scope (opsional tapi disarankan)

Nama folder/domain yang disentuh: `board`, `dialogue`, `dice`, `ai`, `auth`,
`session`, `docs`, `docker`, dll.

## Contoh

```
feat(board): implement grid movement validation in MovementEngine
fix(dice): prevent roll result exceeding max sides
docs(architecture): explain why AI is a separate service
chore(docker): add ollama volume for model persistence
refactor(story): extract choice evaluation into ChoiceEngine
```

## Aturan

- Deskripsi pakai present tense ("add", bukan "added"/"adds").
- 1 commit = 1 perubahan logis (jangan gabung 5 fitur berbeda dalam 1 commit).
- Kalau perlu detail tambahan, tulis di body commit (baris setelah judul,
  dipisah 1 baris kosong) — tidak perlu untuk commit kecil/trivial.
