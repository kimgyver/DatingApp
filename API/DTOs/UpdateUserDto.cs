namespace API.DTOs;

public class UpdateUserDto
{
  public string? NewUserName { get; set; }
  public string? NewPassword { get; set; }
  public string? NewKnownAs { get; set; }
}
