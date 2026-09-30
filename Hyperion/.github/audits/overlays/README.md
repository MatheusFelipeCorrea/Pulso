# Audit Overlays

Place domain-specific context files here to augment generic audit prompts.

Example: `your-project.md` with business rules, regulatory requirements, or domain constraints that auditors should consider.

Reference in `project.yml`:
```yaml
audits:
  overlay: .github/audits/overlays/your-project.md
```

Status operacional do recorte Sprint-3 (módulos já entregues, sem hospedagem): [`sprint-3-recorte-feito.md`](./sprint-3-recorte-feito.md).
