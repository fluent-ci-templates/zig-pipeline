use extism_pdk::*;
use fluentci_pdk::dag;

#[plugin_fn]
pub fn setup(version: String) -> FnResult<String> {
    let version = if version.is_empty() {
        "latest".to_string()
    } else {
        version
    };

    let stdout = dag()
        .pkgx()?
        .with_exec(vec!["pkgx", "install", &format!("zig@{}", version)])?
        .stdout()?;
    Ok(stdout)
}

#[plugin_fn]
pub fn build(args: String) -> FnResult<String> {
    let version = dag().get_env("ZIG_VERSION").unwrap_or_default();
    let mut version = version.as_str();

    if version.is_empty() {
        version = "latest";
    }

    let stdout = dag()
        .pkgx()?
        .with_packages(vec![&format!("zig@{}", version)])?
        .with_exec(vec!["zig", "build", &args])?
        .stdout()?;
    Ok(stdout)
}

#[plugin_fn]
pub fn test(args: String) -> FnResult<String> {
    let version = dag().get_env("ZIG_VERSION").unwrap_or_default();
    let mut version = version.as_str();

    if version.is_empty() {
        version = "latest";
    }

    let stdout = dag()
        .pkgx()?
        .with_packages(vec![&format!("zig@{}", version)])?
        .with_exec(vec!["zig", "build", "test", &args])?
        .stdout()?;
    Ok(stdout)
}
